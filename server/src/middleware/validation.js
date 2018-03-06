const HttpResponseError = require('../httpResponseError');

function ensureUserHasAccessToConference(req, res, next) {
  req.users.hasAccessTo(req.authentication.userId, req.params.conferenceId).then((hasAccess) => {
    if (hasAccess === true) {
      next();
    } else {
      next(new HttpResponseError('FORBIDDEN', 'User does not have access to that conference'));
    }
  });
}

module.exports = { ensureUserHasAccessToConference };
