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

async function validateExistenceOfParameterResources(req, res, next) {
  console.log('validating');

  if (req.params.conferenceId != null) {
    if (!await req.conferences.exists(req.params.conferenceId)) {
      next(new HttpResponseError('NOT_FOUND', 'Conference not found'));
      return;
    }
  }

  if (req.params.sessionId != null) {
    console.log('checking sessions');
    if (!await req.sessions.exists(req.params.sessionId)) {
      next(new HttpResponseError('NOT_FOUND', 'Session not found'));
      return;
    }
  }

  if (req.params.userId != null) {
    if (!await req.users.exists(req.params.userId)) {
      next(new HttpResponseError('NOT_FOUND', 'User not found'));
      return;
    }
  }

  next();
}

module.exports = {
  requireUserToBeAdmin,
  requireUserToBeConferenceAdmin,
  requireUserToBeSiteAdmin,
  ensureUserHasAccessToConference,
  validateExistenceOfParameterResources,
};
