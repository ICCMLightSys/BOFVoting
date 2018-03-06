const HttpResponseError = require('../httpResponseError');

function ensureUserHasAccessToConference(req, res, next) {
  req.users.hasAccessTo(req.authentication.userId, req.params.conferenceId).then((hasAccess) => {
    if (hasAccess === true) {
      next();
    } else {
      next(new HttpResponseError('FORBIDDEN', 'User does not have access to that conference'));
    }
  }).catch(next);
}

function requireUserToBeAdmin(req, res, next) {
  const { userId } = req.authentication;
  const { conferenceId } = req.params;


  req.users.isAdmin(userId, conferenceId).then((isAdmin) => {
    if (isAdmin === true) {
      next();
    } else {
      next(new HttpResponseError('FORBIDDEN', `User ${userId} must have an administrative role`));
    }
  }).catch(next);
}

function requireUserToBeConferenceAdmin(req, res, next) {
  const { userId } = req.authentication;
  const { conferenceId } = req.params;

  req.users.isConferenceAdmin(userId, conferenceId).then((isAdmin) => {
    if (isAdmin === true) {
      next();
    } else {
      next(new HttpResponseError('FORBIDDEN', `User ${userId} is not an administrator of conference ${conferenceId}`));
    }
  }).catch(next);
}

function requireUserToBeSiteAdmin(req, res, next) {
  const { userId } = req.authentication;

  req.users.isSiteAdmin(userId).then((isAdmin) => {
    if (isAdmin === true) {
      next();
    } else {
      next(new HttpResponseError('FORBIDDEN', `User ${userId} is not a site administrator `));
    }
  }).catch(next);
}

module.exports = { requireUserToBeAdmin, requireUserToBeConferenceAdmin, requireUserToBeSiteAdmin, ensureUserHasAccessToConference };
