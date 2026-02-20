package com.expensum.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.PriorityOrdered;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Explicit Flyway configuration for Spring Boot 4.x.
 *
 * Spring Boot 4.x does not reliably trigger Flyway via classpath autoconfiguration alone.
 * This class:
 *   1. Creates the Flyway bean and calls migrate() via initMethod on initialization
 *   2. Implements BeanDefinitionRegistryPostProcessor to inject dependsOn("flyway")
 *      into the entityManagerFactory bean definition — guaranteeing migrations
 *      complete before Hibernate schema validation runs.
 */
@Configuration
public class FlywayConfig implements BeanDefinitionRegistryPostProcessor, PriorityOrdered {

    private static final String ENTITY_MANAGER_FACTORY_BEAN = "entityManagerFactory";
    private static final String FLYWAY_BEAN = "flyway";

    /**
     * Creates and configures the Flyway instance.
     * initMethod = "migrate" ensures migrations run when this bean is initialized,
     * which is guaranteed to happen before entityManagerFactory (see postProcessBeanDefinitionRegistry).
     */
    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)   // safe for both fresh and pre-existing schemas
                .load();
    }

    /**
     * Programmatically adds dependsOn("flyway") to the JPA entityManagerFactory
     * bean definition. This runs before any bean is instantiated, so the dependency
     * graph is correct from the start — Flyway always runs before Hibernate validates.
     */
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        if (registry.containsBeanDefinition(ENTITY_MANAGER_FACTORY_BEAN)) {
            BeanDefinition bd = registry.getBeanDefinition(ENTITY_MANAGER_FACTORY_BEAN);
            String[] existing = bd.getDependsOn();
            Set<String> deps = new LinkedHashSet<>(
                    Arrays.asList(existing != null ? existing : new String[0])
            );
            deps.add(FLYWAY_BEAN);
            bd.setDependsOn(deps.toArray(new String[0]));
        }
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // no-op — all ordering work done in postProcessBeanDefinitionRegistry
    }

    /** Run after ConfigurationClassPostProcessor (which registers all @Bean definitions). */
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
