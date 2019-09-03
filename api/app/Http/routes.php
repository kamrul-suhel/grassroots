<?php

//accounts
$app->group(['prefix' => '/v1/accounts', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AccountController@get_accounts');
    $app->get('/{id}/statements', 'AccountController@get_account_statements');
    $app->get('/{id}', 'AccountController@get_account');
    $app->post('/', 'AccountController@create_account');
    $app->put('/{id}', 'AccountController@update_account');
    $app->delete('/{id}', 'AccountController@delete_account');
    $app->get('/franchise/{franchise_id}/club/{club_id}', 'AccountController@getAccountByFranchiseAndClubId');
});

//accounts types
$app->group(['prefix' => '/v1/account-types', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AccountTypeController@get_account_types');
    $app->get('/{id}', 'AccountTypeController@get_account_type');
    $app->post('/', 'AccountTypeController@create_account_type');
    $app->put('/{id}', 'AccountTypeController@update_account_type');
    $app->delete('/{id}', 'AccountTypeController@delete_account_type');
});

//address
$app->group(['prefix' => '/v1/addresses', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AddressBookController@get_addresses');
    $app->get('/{address_id}', 'AddressBookController@get_address');
    $app->post('/', 'AddressBookController@create_address');
    $app->put('/{address_id}', 'AddressBookController@update_address');
    $app->delete('/{address_id}', 'AddressBookController@delete_address');
});

//address type
$app->group(['prefix' => '/v1/addresses-types', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AddressTypeController@get_addresses_types');
    $app->get('/{type_id}', 'AddressTypeController@get_address_type');
    $app->post('/', 'AddressTypeController@create_address_type');
    $app->put('/{type_id}', 'AddressTypeController@update_address_type');
    $app->delete('/{type_id}', 'AddressTypeController@delete_address_type');
});

//age group
$app->group(['prefix' => '/v1/age-groups', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AgeGroupController@get_age_groups');
    $app->get('/{agegroup_id}', 'AgeGroupController@get_age_group');
    $app->post('/', 'AgeGroupController@create_age_group');
    $app->put('/{agegroup_id}', 'AgeGroupController@update_age_group');
    $app->delete('/{agegroup_id}', 'AgeGroupController@delete_age_group');
});

//assessments
$app->group(['prefix' => '/v1/assessments', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AssessmentController@get_assessments');
    $app->get('/templates', 'AssessmentController@get_assessments_templates');
    $app->get('/{assessment_id}', 'AssessmentController@get_assessment');
    $app->get('/{assessment_id}/questions', 'AssessmentController@get_template_questions');
    $app->post('/', 'AssessmentAnswerController@create_assessment_answer');
    $app->put('/{id}', 'AssessmentAnswerController@update_assessment_answer');
    $app->post('/templates', 'AssessmentController@create_template');
    $app->delete('{id}', 'AssessmentAnswerController@delete_assessment_answer');
});

//auth
$app->group(['prefix' => '/v1/auth', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/login', 'AuthController@login');
    $app->post('/register', 'AuthController@register');
    $app->post('/password-reset', 'AuthController@handle_reset_password');
    $app->put('/password-reset/{token}', 'AuthController@reset_password');
    $app->get('/club/{slug}', 'AuthController@get_club_by_slug');
});

//availability
$app->group(['prefix' => '/v1/availabilities', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'AvailabilityController@get_availabilities');
    $app->get('/{availability_id}', 'AvailabilityController@get_availability');
    $app->post('/', 'AvailabilityController@create_availability');
    $app->put('/{availability_id}', 'AvailabilityController@update_availability');
    $app->delete('/{availability_id}', 'AvailabilityController@delete_availability');
});

//clubs
$app->group(['prefix' => '/v1/clubs', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'ClubController@get_clubs');
    $app->get('/{club_id}/teams', 'ClubController@get_teams');
    $app->get('/{club_id}/skills', 'ClubController@get_skills');
    $app->get('/{club_id}/kits', 'ClubController@get_kits');
    $app->get('/{club_id}/admins', 'ClubController@get_admins');
    $app->get('/{club_id}/package', 'ClubController@get_packages');
    $app->get('/{club_id}', 'ClubController@get_club');
    $app->post('/add-size-chart', 'ClubController@add_size_chart');
    $app->post('/{club_id}/complete-package', 'ClubController@update_complete_status');
    $app->post('/', 'ClubController@create_club');
    $app->put('/{club_id}', 'ClubController@update_club');
    $app->put('/{rel_club_package_id}/update-package', 'ClubController@update_package');
    $app->put('/{rel_club_package_id}/package-action', 'ClubController@activate_deactivate_package');
    $app->delete('/{club_id}', 'ClubController@delete_club');
});

//coaches
$app->group(['prefix' => '/v1/coaches', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'CoachController@get_coaches');
    $app->get('/{coach_id}', 'CoachController@get_coach');
    $app->post('/', 'CoachController@create_coach');
    $app->put('/{coach_id}', 'CoachController@update_coach');
    $app->post('{coach_id}/payments', 'CoachController@makePayment');
    $app->get('/{coach_id}/teams', 'CoachController@get_coach_teams');
    $app->get('/{coach_id}/checklists', 'CoachController@get_coach_checklists');
    $app->get('/{coach_id}/assessments', 'CoachController@get_coach_assessments');
    $app->get('/{coach_id}/assessments/{assessment_id}', 'CoachController@get_coach_assessment');
});

//consents
$app->group(['prefix' => '/v1/consents', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'ConsentController@get_consents');
    $app->get('/{consent_id}', 'ConsentController@get_consent');
    $app->post('/', 'ConsentController@create_consent');
    $app->put('/{consent_id}', 'ConsentController@accept_consent');
});

//downloads
$app->group(['prefix' => '/v1/downloads', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'DownloadController@get_downloads');
    $app->get('/{download_id}', 'DownloadController@get_download');
    $app->post('/', 'DownloadController@create_download');
    $app->put('/{download_id}', 'DownloadController@update_download');
    $app->delete('/{download_id}', 'DownloadController@delete_download');
});

//downloads categories
$app->group(['prefix' => '/v1/download-categories', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'DownloadCategoryController@list');
    $app->post('/', 'DownloadCategoryController@create');
});

//dropdown
$app->group(['prefix' => '/v1/dropdown', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/address-type', 'DropdownController@get_address_type');
    $app->get('/age-groups', 'DropdownController@get_age_groups');
    $app->get('/availability-type', 'DropdownController@get_availability_types');
    $app->get('/kit-types', 'DropdownController@get_kit_type');
    $app->get('/programme', 'DropdownController@get_programme');
    $app->get('/venues', 'DropdownController@get_venues');
    $app->get('/coaches', 'DropdownController@get_coaches');
    $app->get('/companies', 'DropdownController@get_club_companies');
    $app->get('/match-types', 'DropdownController@get_match_types');
    $app->get('/schools', 'DropdownController@get_schools');
    $app->get('/player-statuses', 'DropdownController@get_players_status');
    $app->get('/players', 'DropdownController@get_players');
    $app->get('/guardians', 'DropdownController@get_guardians');
    $app->get('/skills', 'DropdownController@get_skills');
    $app->get('/skill-categories', 'DropdownController@get_skills_category');
    $app->get('/qualifications', 'DropdownController@get_qualifications');
    $app->get('/coach-assessment-templates', 'DropdownController@get_assessment_templates');
    $app->get('/team-players', 'DropdownController@get_team_players');
    $app->get('/team-ranks', 'DropdownController@get_team_rank');
    $app->get('/trial-dates', 'DropdownController@get_trial_sessions');
    $app->get('/users', 'DropdownController@get_users');
    $app->get('/kit-items', 'DropdownController@get_kit_items');
    $app->get('/skillgroup-players/{team_id}', 'DropdownController@get_skill_group_players');
    $app->get('/programme-types/{type}', 'DropdownController@get_programme_type');
    $app->get('/roles', 'DropdownController@get_roles');
    $app->get('/teams/{type}', 'DropdownController@get_teams');
    $app->get('/team-types', 'DropdownController@get_teams_types');
    $app->get('/consents', 'DropdownController@getConsent');
    $app->get('parents/{parent_id}/programmes-players', 'DropdownController@getProgrammeAndPlayerByParentId');
});

//export
$app->group(['prefix' => '/v1/export', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/players', 'ExportController@export_players');
    $app->get('/teams', 'ExportController@export_teams');
    $app->get('/guardians', 'ExportController@export_guardians');
});

//email
$app->group(['prefix' => '/v1/email', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/', 'EmailController@send_email');
});

//faq
$app->group(['prefix' => '/v1/faq', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/', 'FaqController@create');
    $app->post('/fileupload', 'FaqController@fileUpload');
    $app->get('/', 'FaqController@list');
    $app->get('/{id}', 'FaqController@single');
    $app->post('/{id}', 'FaqController@update');
    $app->delete('/{id}', 'FaqController@delete');
});

//feedbacks
$app->group(['prefix' => '/v1/feedbacks', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'FeedbackController@get_feedbacks');
    $app->get('/{feedback_id}', 'FeedbackController@get_feedback');
    $app->post('/{feedback_id}/answer', 'FeedbackAnswerController@create_feedback_answer');
    $app->post('/', 'FeedbackController@create_feedback');
});

//fixtures
$app->group(['prefix' => '/v1/fixtures', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'FixtureController@get_fixtures');
    $app->get('/{fixture_id}', 'FixtureController@get_fixture');
    $app->post('/', 'FixtureController@create_fixture');
});

//franchises
$app->group(['prefix' => '/v1/franchises', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'FranchiseController@getFranchises');
    $app->get('/packages', 'FranchiseController@get_packages');
    $app->get('/{id}', 'FranchiseController@single');
    $app->get('/{id}/clubs', 'FranchiseController@get_franchise_clubs');
    $app->post('/buy-package', 'FranchiseController@buy_package');
    $app->post('/{id}', 'FranchiseController@update_franchise');
});

//homeworks
$app->group(['prefix' => '/v1/homeworks', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'HomeworkController@get_homeworks');
    $app->get('/{homework_id}', 'HomeworkController@get_homework');
    $app->post('/{homework_id}/answer', 'FeedbackAnswerController@create_feedback_answer');
    $app->post('/', 'HomeworkController@create_homework');
    $app->put('/{homework_id}', 'HomeworkController@update_homework');
    $app->delete('/{homework_id}', 'HomeworkController@delete_homework');
});

//invoices
$app->group(['prefix' => '/v1/invoices', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'InvoiceController@list');
    $app->get('/{id}', 'InvoiceController@single');
    $app->put('/{id}', 'InvoiceController@update');
    $app->post('/', 'InvoiceController@create_invoice');
    $app->delete('/{id}', 'InvoiceController@delete');
});

//kits
$app->group(['prefix' => '/v1/kits', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'KittController@get_kits');
    $app->get('/{kit_id}', 'KittController@get_kit');
    $app->post('/', 'KittController@create_kit');
    $app->post('/assign', 'KittController@assign_kit');
    $app->post('/{kit_id}', 'KittController@update_kit');
    $app->post('/{kit_user_id}/select-size', 'KittController@select_size');
    $app->delete('/{kit_id}', 'KittController@delete_kit');
});

//kit users
$app->group(['prefix' => '/v1/kit_users', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->put('{kit_id}', 'KittUserController@update');
    $app->delete('{kit_id}', 'KittUserController@delete');
});

//messages
$app->group(['prefix' => '/v1/messages', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'MessageController@get_messages');
    $app->get('/{message_id}', 'MessageController@get_message');
    $app->post('/', 'MessageController@create_message');
    $app->put('/{message_id}', 'MessageController@update_message');
    $app->delete('/{message_id}', 'MessageController@delete_message');
});

//notifications
$app->group(['prefix' => '/v1/notifications', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'NotificationController@get_notifications');
    $app->put('/', 'NotificationController@mark_all_notification');
    $app->put('/{id}', 'NotificationController@update_notification');
    $app->delete('/{id}', 'NotificationController@delete_notification');
});

//packages
$app->group(['prefix' => '/v1/packages', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'PackageController@get_packages');
    $app->get('/{id}', 'PackageController@get_package');
    $app->post('/', 'PackageController@create_package');
    $app->put('/{id}', 'PackageController@update_package');
    $app->delete('/{id}', 'PackageController@delete_package');
});

//pages
$app->group(['prefix' => '/v1/pages', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/', 'PageController@create');
    $app->get('/', 'PageController@list');
    $app->get('/{slug_or_id}', 'PageController@single');
    $app->post('/{id}', 'PageController@update');
    $app->delete('/{id}', 'PageController@delete');
});

//players
$app->group(['prefix' => '/v1/players', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'PlayerController@get_players');
    $app->get('/search/{club_id}', 'PlayerController@getPlayersByClubId');
    $app->put('kits/remove/{relKitPlayerId}', 'PlayerController@removePlayerKitItem');
    $app->get('/{player_id}', 'PlayerController@get_player');
    $app->post('/', 'PlayerController@create_player');
    $app->put('/{player_id}/assign', 'PlayerController@assign_player_teams');
    $app->get('/{player_id}/check_sessions', 'PlayerController@checkPlayerSession');
    $app->get('/{player_id}/remove_sessions_programmes', 'PlayerController@removePlayerProgrammeAndSession');
    $app->put('/{player_id}/assign-single', 'PlayerController@assignSinglePlayerToTeam');
    $app->get('/{player_id}/remove', 'PlayerController@removeAllTeamFromPlayer');
    $app->put('/{player_id}/status', 'PlayerController@update_status');
    $app->put('/{player_id}/notes', 'PlayerController@updateNote');
    $app->put('/{player_id}', 'PlayerController@update_player');
    $app->get('/{player_id}/homeworks', 'PlayerController@get_player_homeworks');
    $app->get('/{player_id}/kits', 'PlayerController@get_player_kits');
    $app->get('{player_id}/skill-assessments', 'PlayerController@get_skill_assessments');
    $app->get('{player_id}/sessions/{session_id}', 'PlayerController@get_player_session');
});

//programmes
$app->group(['prefix' => '/v1/programmes', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'ProgrammeController@get_programms');
    $app->get('/{programme_id}', 'ProgrammeController@get_programme');
    $app->post('/', 'ProgrammeController@create_programme');
    $app->put('/{programme_id}', 'ProgrammeController@update_programme');
    $app->put('/{programme_id}/accept', 'ProgrammeController@accept_reject_programme');
    $app->delete('/{programme_id}', 'ProgrammeController@delete_programme');
    $app->get('/{programme_id}/sessions', 'ProgrammeController@get_programme_sessions');
    $app->get('{programme_id}/download', 'ProgrammeController@downloadImage');
});

//public
$app->group(['prefix' => '/v1/public', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/clients', 'PublicController@get_gc_clients');
    $app->get('/programmes', 'PublicController@get_compatible_programmes');
    $app->post('/register-accounts', 'PublicController@register_accounts');
    $app->post('/register-franchise', 'PublicController@register_franchsie');
});

//refer
$app->group(['prefix' => '/v1/refer', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/', 'ReferController@send_refer_email');
});

//requests
$app->group(['prefix' => '/v1/requests', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'EventRequestController@get_event_requests');
    $app->get('/{request_id}', 'EventRequestController@get_event_request');
    $app->post('/', 'EventRequestController@create_event_request');
    $app->put('/accept-reject/{request_id}', 'EventRequestController@accept_reject_event');
    $app->put('/{request_id}', 'EventRequestController@update_event_request');
    $app->delete('/{request_id}', 'EventRequestController@delete_event_request');
});

//scan
$app->group(['prefix' => '/v1/scans', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->delete('/{scan_id}', 'ScanController@delete_scan');
    $app->put('/{scan_id}', 'ScanController@update');
});

//sessions
$app->group(['prefix' => '/v1/sessions', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'SessionController@get_sessions');
    $app->get('/{session_id}', 'SessionController@get_session');
    $app->get('/{session_id}/players', 'SessionController@get_session_players');
    $app->post('/', 'SessionController@create_session');
    $app->put('/{session_id}', 'SessionController@update_session');
    $app->put('/{session_id}/accept', 'SessionController@accept_reject_session');
    $app->put('/{session_id}/attendance', 'SessionController@take_attendance');
});

//skill-assessments
$app->group(['prefix' => '/v1/skill-assessments', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'SkillAssessmentController@get_skill_assesments');
    $app->get('/available-players', 'SkillAssessmentController@get_avaiable_players');
    $app->get('/{grade_id}', 'SkillAssessmentController@get_skill_assessment');
    $app->post('/', 'SkillAssessmentController@create_skill_assessment');
    $app->put('/{grade_id}', 'SkillAssessmentController@update_skill_assesment');
    $app->delete('/{grade_id}', 'SkillAssessmentController@delete_skill_assesment');
});

//skills
$app->group(['prefix' => '/v1/skills', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'SkillController@get_skills');
    $app->get('/{skill_id}', 'SkillController@get_skill');
    $app->post('/', 'SkillController@create_skill');
    $app->put('/{skill_id}', 'SkillController@update_skill');
    $app->delete('/{skill_id}', 'SkillController@delete_skill');
});

//statements
$app->group(['prefix' => '/v1/statements', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'StatementController@get_statement');
    $app->post('/', 'StatementController@createStatement');
    $app->put('/', 'StatementController@updatedStatement');
    $app->get('/users', 'StatementController@get_statements');
    $app->get('/franchises/{franchise_id}', 'StatementController@getStatementByFranchiseId');
    $app->get('/club', 'StatementController@getStatementForClub');
});

//sponsors
$app->group(['prefix' => '/v1/sponsors', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'SponsorController@list');
    $app->get('/{id}', 'SponsorController@single');
    $app->post('/', 'SponsorController@create');
    $app->put('/{id}', 'SponsorController@update');
    $app->delete('/{id}', 'SponsorController@delete');
});

//teams
$app->group(['prefix' => '/v1/teams', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TeamController@get_teams_list');
    $app->put('/update-status', 'TeamController@updateRelPlayerTeamStatus');
    $app->get('/{team_id}', 'TeamController@get_team');
    $app->post('/{team_id}/assign-kit', 'TeamController@assign_kits');
    $app->post('/', 'TeamController@create_team');
    $app->put('/{team_id}', 'TeamController@update_team');
    $app->put('/{team_id}/assign-players', 'TeamController@change_player_team_status');
    $app->delete('/{team_id}', 'TeamController@delete_team');
});

//terms
$app->group(['prefix' => 'v1/terms', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TermsConditionsController@get_terms_conditions');
    $app->get('/{tc_id}', 'TermsConditionsController@get_term_condition');
    $app->post('/{tc_id}', 'TermsConditionsController@accept_term_condition');
});

//timetable
$app->group(['prefix' => '/v1/timetable', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TimetableController@get_timetable');
});

//todo
$app->group(['prefix' => '/v1/todos', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TodoController@get_todos');
    $app->get('/{todo_id}', 'TodoController@get_todo');
    $app->post('/', 'TodoController@create_todo');
    $app->put('/{todo_id}', 'TodoController@update_todo');
    $app->put('/{todo_id}/complete', 'TodoController@complete_todo');
    $app->delete('/{todo_id}', 'TodoController@delete_todo');
});

//topics
$app->group(['prefix' => '/v1/topics', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TopicController@get_topics');
    $app->post('/', 'TopicController@create_topic');
    $app->get('/{topic_id}', 'TopicController@get_topic');
    $app->get('/{topic_id}/messages', 'TopicController@get_topic_messages');
    $app->put('/{topic_id}', 'TopicController@update_topic');
    $app->delete('/{topic_id}', 'TopicController@delete_topic');
});

//transactions
$app->group(['prefix' => '/v1/transactions', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TransactionController@get_transactions');
    $app->get('/{id}', 'TransactionController@get_transaction');
    $app->post('/', 'TransactionController@create_transaction');
    $app->post('/transfer', 'TransactionController@create_tansfer_between_accounts');
    $app->put('/{id}', 'TransactionController@update_transaction');
    $app->delete('/{id}', 'TransactionController@delete_transaction');
});

//transactions codes
$app->group(['prefix' => '/v1/transaction-codes', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TransactionCodeController@get_transactions_codes');
    $app->get('/{id}', 'TransactionCodeController@get_transaction_code');
    $app->post('/', 'TransactionCodeController@create_transaction_code');
    $app->put('/{id}', 'TransactionCodeController@update_transaction_code');
    $app->delete('/{id}', 'TransactionCodeController@delete_transaction_code');
});

//transactions types
$app->group(['prefix' => '/v1/transaction-types', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TransactionTypeController@get_transactions_types');
    $app->get('/{id}', 'TransactionTypeController@get_transaction_type');
    $app->post('/', 'TransactionTypeController@create_transaction_type');
    $app->put('/{id}', 'TransactionTypeController@update_transaction_type');
    $app->delete('/{id}', 'TransactionTypeController@delete_transaction_type');
});

//uploads
$app->group(['prefix' => '/v1/upload', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/qualifications', 'UploadController@upload_qualifications');
    $app->post('/test', 'UploadController@multiple_upload');
    $app->post('/{type}', 'UploadController@upload_scans');
});

//users
$app->group(['prefix' => '/v1/users', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/', 'UserController@create');
    $app->put('/{user_id}', 'UserController@updateUser');
    $app->get('/', 'UserController@get_users');
    $app->put('{user_id}/password', 'UserController@update_password');
    $app->get('/guardians', 'SelectController@get_guardians_by_name');
    $app->get('/{user_id}', 'UserController@get_user');
    $app->get('/{user_id}/statements', 'UserController@get_user_statements');
    $app->post('/qualifications', 'UserController@upload_qualifications');
    $app->post('/scans', 'UserController@upload_scans');
    $app->post('/{user_id}', 'UserController@update_user');
    $app->delete('/{user_id}', 'UserController@delete_user');
    $app->get('/{user_id}/programms', 'UserController@get_user_programms');
    $app->get('/{user_id}/feedbacks', 'UserController@get_user_feedbacks');
    $app->post('{user_id}/qestion/{question_id}', 'UserController@create_user_answer');
});

$app->group(['prefix' => '/v1', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('/file', 'FileController@saveFile');
    $app->get('/path', 'FileController@foo_bar');
});


/**
 * Parent route
 */
$app->group(['prefix' => '/v1/parents', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->post('{parent_id}/statements/create', 'ParentController@createStatement');
    $app->put('{parent_id}/statements/update', 'ParentController@updateStatement');
});

//test
$app->group(['prefix' => '/v1/test', 'namespace' => 'App\Http\Controllers'], function ($app) {
    $app->get('/', 'TestController@foo');
    $app->get('/email', 'TestController@send_email');
    $app->get('/players/{guardian_id}', 'TestController@unique_players_in_programmes');
    $app->get('/latitude', 'TestController@update_lat_lng');
    $app->get('/payment', 'TestController@getPayment');
    $app->get('/paymenttest', 'TestController@getPaymentTest');
    $app->get('/cron', 'CronJobController@makePayment');
    $app->get('/paymentstatus', 'CronJobController@updateGoCardLessPaymentStatus');
});


// Go cardless
$app->group([
    'prefix' => '/v1/gocardless',
    'namespace' => 'App\Http\Controllers'
], function ($app) {
    $app->get('/', 'GoCardlessController@index');
    $app->get('/customer/verify', 'GoCardlessController@verifyCustomer');
//    $app->get('/payments', 'GoCardlessController@makePayment');
});

?>
