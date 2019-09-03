
export const detailsComplete = club => {
    if (club.address && club.telephone && club.email && club.type) {
        return true;
    }
    return false;
}

export const ageGroupsComplete = club => {
    if (club.agegroups && club.agegroups.length > 0) {
        return true;
    }
    return false;
}

export const academySetupComplete = club => {
    if (club.teams && club.teams.length > 0 && _.filter(club.teams, { type: 'skill-group' }).length > 0) {
        return true;
    }
    return false;
}

export const fcSetupComplete = club => {
    if (club.teams && club.teams.length > 0 && _.filter(club.teams, { type: 'team' }).length > 0) {
        return true;
    }
    return false;
}

export const bankAccountsComplete = club => {
    if (club.accounts && club.accounts.length > 0) {
        let foo = true;
        club.accounts.map((account) => {
            if (!account.bank_name && account.type_id === 1) foo = false;
        });
        return foo;
    }
    return false;
}

export const kitsComplete = club => {
    if (club.kits && club.kits.length > 0 && !_.isEmpty(club.size_chart)) {
        return true;
    }
    return false;
}

export const skillsComplete = club => {
    if (club.skills && club.skills.length > 0) {
        return true;
    }
    return false;
}

export const socialComplete = club => {
    if((club.facebook_url && club.facebook_url.length > 0) &&
        (club.twitter_url && club.twitter_url.length > 0) &&
        (club.youtube_url && club.youtube_url.length > 0) &&
        (club.instagram_url && club.instagram_url.length > 0)){
        return true;
    }
    return false;
}

export const assessmentFromComplete = assessments => {
    if(assessments.count && assessments.count > 0){
        return true
    }
    return false
}

export const hasOneProgramme = programmes => {
    if(programmes.count && programmes.count > 0){
        return true
    }
    return false
}

export const allComplete = club => {
    const cluborschool = (fcSetupComplete(club) || academySetupComplete(club) ? true : false);
    return(
        detailsComplete(club) &&
        ageGroupsComplete(club) &&
        cluborschool &&
        bankAccountsComplete(club) &&
        kitsComplete(club) &&
        skillsComplete(club)
    )
}

export const totalSoccerSchool = club => {
    return club.teams && _.filter(club.teams, team => team.type === 'skill-group').length
}

export const totalFootballClub = club => {
    return club.teams &&_.filter(club.teams, team => team.type === 'team').length;
}

export const totalFinancialAccount = club => {
    return club.teams && club.accounts && club.accounts.length;
}

export const totalKitItem = club => {
    return club.teams && club.kits && club.kits.length ? club.kits.length : 0;
}

export const totalSkill = club => {
    return club.skills && club.skills.length ? club.skills.length : 0;
}

export const totalSocialLinkComplete = club => {
    let count = 0;
    club.facebook_url && club.facebook_url ? count = count + 1 : '';

    club.instagram_url && club.instagram_url ? count = count + 1 : '';

    club.twitter_url && club.twitter_url ? count = count + 1 : '';

    club.youtube_url && club.youtube_url ? count = count + 1 : '';

    return count;
}