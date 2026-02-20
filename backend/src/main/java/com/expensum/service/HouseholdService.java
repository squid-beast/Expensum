package com.expensum.service;

import com.expensum.dto.household.*;
import com.expensum.entity.*;
import com.expensum.exception.BadRequestException;
import com.expensum.exception.ResourceNotFoundException;
import com.expensum.exception.UnauthorizedException;
import com.expensum.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository memberRepository;
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;

    @Transactional
    public HouseholdResponse createHousehold(Long userId, CreateHouseholdRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Household household = new Household();
        household.setName(request.getName());
        household.setCreatedBy(user);
        household.setInviteCode(UUID.randomUUID().toString());
        household = householdRepository.save(household);

        HouseholdMember member = new HouseholdMember();
        member.setHousehold(household);
        member.setUser(user);
        member.setRole(HouseholdRole.OWNER);
        member.setJoinedAt(LocalDateTime.now());
        memberRepository.save(member);

        return toResponse(household, 1);
    }

    public List<HouseholdResponse> getUserHouseholds(Long userId) {
        List<HouseholdMember> memberships = memberRepository.findByUserId(userId);
        return memberships.stream()
                .map(m -> {
                    Household h = m.getHousehold();
                    int count = memberRepository.findByHouseholdId(h.getId()).size();
                    return toResponse(h, count);
                })
                .toList();
    }

    public HouseholdDetailResponse getHouseholdDetail(Long userId, Long householdId) {
        verifyMembership(userId, householdId);
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        List<MemberDto> members = memberRepository.findByHouseholdId(householdId).stream()
                .map(m -> new MemberDto(
                        m.getUser().getId(),
                        m.getUser().getFullName(),
                        m.getUser().getEmail(),
                        m.getRole().name(),
                        m.getJoinedAt()))
                .toList();

        return HouseholdDetailResponse.builder()
                .id(household.getId())
                .name(household.getName())
                .inviteCode(household.getInviteCode())
                .createdById(household.getCreatedBy().getId())
                .createdByName(household.getCreatedBy().getFullName())
                .createdAt(household.getCreatedAt())
                .members(members)
                .build();
    }

    @Transactional
    public InvitationResponse inviteMember(Long userId, Long householdId, InviteRequest request) {
        verifyMembership(userId, householdId);

        User inviter = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        // Check if already a member by email
        userRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
            if (memberRepository.existsByHouseholdIdAndUserId(householdId, existingUser.getId())) {
                throw new BadRequestException("This user is already a member of the household");
            }
        });

        // Check for existing pending invitation
        if (invitationRepository.existsByHouseholdIdAndInviteeEmailAndStatus(
                householdId, request.getEmail(), InvitationStatus.PENDING)) {
            throw new BadRequestException("An invitation is already pending for this email");
        }

        Invitation invitation = new Invitation();
        invitation.setHousehold(household);
        invitation.setInviterUser(inviter);
        invitation.setInviteeEmail(request.getEmail());
        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setToken(UUID.randomUUID().toString());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(7));
        invitation = invitationRepository.save(invitation);

        return toInvitationResponse(invitation);
    }

    public List<InvitationResponse> getPendingInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return invitationRepository.findByInviteeEmailAndStatus(user.getEmail(), InvitationStatus.PENDING)
                .stream()
                .filter(inv -> inv.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(this::toInvitationResponse)
                .toList();
    }

    @Transactional
    public void acceptInvitation(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        if (!invitation.getInviteeEmail().equalsIgnoreCase(user.getEmail())) {
            throw new UnauthorizedException("This invitation is not for you");
        }
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This invitation has expired");
        }
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("This invitation has already been " + invitation.getStatus().name().toLowerCase());
        }
        if (memberRepository.existsByHouseholdIdAndUserId(invitation.getHousehold().getId(), userId)) {
            throw new BadRequestException("You are already a member of this household");
        }

        HouseholdMember member = new HouseholdMember();
        member.setHousehold(invitation.getHousehold());
        member.setUser(user);
        member.setRole(HouseholdRole.MEMBER);
        member.setJoinedAt(LocalDateTime.now());
        memberRepository.save(member);

        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);
    }

    @Transactional
    public void declineInvitation(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        if (!invitation.getInviteeEmail().equalsIgnoreCase(user.getEmail())) {
            throw new UnauthorizedException("This invitation is not for you");
        }
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("This invitation has already been " + invitation.getStatus().name().toLowerCase());
        }

        invitation.setStatus(InvitationStatus.DECLINED);
        invitationRepository.save(invitation);
    }

    public void verifyMembership(Long userId, Long householdId) {
        if (!memberRepository.existsByHouseholdIdAndUserId(householdId, userId)) {
            throw new UnauthorizedException("Not a member of this household");
        }
    }

    private HouseholdResponse toResponse(Household h, int memberCount) {
        return HouseholdResponse.builder()
                .id(h.getId())
                .name(h.getName())
                .inviteCode(h.getInviteCode())
                .createdById(h.getCreatedBy().getId())
                .createdByName(h.getCreatedBy().getFullName())
                .memberCount(memberCount)
                .createdAt(h.getCreatedAt())
                .build();
    }

    private InvitationResponse toInvitationResponse(Invitation inv) {
        return InvitationResponse.builder()
                .id(inv.getId())
                .token(inv.getToken())
                .householdName(inv.getHousehold().getName())
                .householdId(inv.getHousehold().getId())
                .inviterName(inv.getInviterUser().getFullName())
                .inviteeEmail(inv.getInviteeEmail())
                .status(inv.getStatus().name())
                .createdAt(inv.getCreatedAt())
                .expiresAt(inv.getExpiresAt())
                .build();
    }
}
