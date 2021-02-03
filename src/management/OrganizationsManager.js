var ArgumentError = require('rest-facade').ArgumentError;
var utils = require('../utils');
var Auth0RestClient = require('../Auth0RestClient');
var RetryRestClient = require('../RetryRestClient');

/**
 * Simple facade for consuming a REST API endpoint.
 * @external RestClient
 * @see https://github.com/ngonzalvez/rest-facade
 */

/**
 * @class OrganizationsManager
 * The organizations class provides a simple abstraction for performing CRUD operations
 * on Auth0 OrganizationsManager.
 * @constructor
 * @memberOf module:management
 *
 * @param {Object} options            The client options.
 * @param {String} options.baseUrl    The URL of the API.
 * @param {Object} [options.headers]  Headers to be included in all requests.
 * @param {Object} [options.retry]    Retry Policy Config
 */
var OrganizationsManager = function(options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide manager options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  /**
   * Options object for the Rest Client instance.
   *
   * @type {Object}
   */
  var clientOptions = {
    headers: options.headers,
    query: { repeatParams: false }
  };

  /**
   * Provides an abstraction layer for performing CRUD operations on
   * {@link https://auth0.com/docs/api/v2#!/RolesManager Auth0 RolesManagers}.
   *
   * @type {external:RestClient}
   */
  var auth0RestClient = new Auth0RestClient(
    options.baseUrl + '/organizations/:id',
    clientOptions,
    options.tokenProvider
  );
  this.organizations = new RetryRestClient(auth0RestClient, options.retry);

  var connectionsInRoleClient = new Auth0RestClient(
    options.baseUrl + '/organizations/:id/enabled_connections/:connection_id',
    clientOptions,
    options.tokenProvider
  );
  this.connections = new RetryRestClient(connectionsInRoleClient, options.retry);

  var membersClient = new Auth0RestClient(
    options.baseUrl + '/organizations/:id/members',
    clientOptions,
    options.tokenProvider
  );
  this.members = new RetryRestClient(membersClient, options.retry);
};

/**
 * Create a new organization.
 *
 * @method    create
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * management.organizations.create(data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Organization created.
 * });
 *
 * @param   {Object}    data     Organization data object.
 * @param   {Function}  [cb]     Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(OrganizationsManager, 'create', 'organizations.create');

/**
 * Get all roles.
 *
 * @method    getAll
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example <caption>
 *   This method takes an optional object as first argument that may be used to
 *   specify pagination settings. If pagination options are not present,
 *   the first page of a limited number of results will be returned.
 * </caption>
 *
 * // Pagination settings.
 * var params = {
 *   per_page: 10,
 *   page: 0
 * };
 *
 * management.organizations.getAll(params, function (err, organizations) {
 *   console.log(organizations.length);
 * });
 *
 * @param   {Object}    [params]          Organizations parameters.
 * @param   {Number}    [params.per_page] Number of results per page.
 * @param   {Number}    [params.page]     Page number, zero indexed.
 * @param   {Function}  [cb]              Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(OrganizationsManager, 'getAll', 'organizations.getAll');

/**
 * Get an Auth0 organization.
 *
 * @method    get
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * management.organizations.get({ id: ORGANIZATION_ID }, function (err, role) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(organization);
 * });
 *
 * @param   {Object}    params        Organization parameters.
 * @param   {String}    params.id     Organization ID.
 * @param   {Function}  [cb]          Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(OrganizationsManager, 'get', 'organizations.get');

/**
 * Update an existing organization.
 *
 * @method    update
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * var data = { name: 'New name' };
 * var params = { id: ORGANIZATION_ID };
 *
 * // Using auth0 instance.
 * management.updateOrganization(params, data, function (err, organization) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(organization.name);  // 'New name'
 * });
 *
 * // Using the organizations manager directly.
 * management.organizations.update(params, data, function (err, organization) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(organization.name);  // 'New name'
 * });
 *
 * @param   {Object}    params        Organization parameters.
 * @param   {String}    params.id     Organization ID.
 * @param   {Object}    data          Updated organization data.
 * @param   {Function}  [cb]          Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(OrganizationsManager, 'update', 'organizations.patch');

/**
 * Delete an existing organization.
 *
 * @method    delete
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * management.organizations.delete({ id: ORGANIZATION_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Organization deleted.
 * });
 *
 * @param   {Object}    params        Organization parameters.
 * @param   {String}    params.id     Organization ID.
 * @param   {Function}  [cb]          Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(OrganizationsManager, 'delete', 'organizations.delete');

/**
 * Get Connections in a Organization
 *
 * @method    getEnabledConnections
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * var params = {id : 'ORGANIZATION_ID'}
 * @example <caption>
 *   This method takes an organization ID and returns the enabled connections in an Organization
 * </caption>
 *
 * management.organizations.getEnabledConnections( {id : 'ORGANIZATION_ID'}, function (err, enabled_connections) {
 *   console.log(enabled_connections);
 * });
 *
 * @param   {String}    [organization_id]   Organization ID
 * @param   {Function}  [cb]                Callback function.
 *
 * @return  {Promise|undefined}
 */
OrganizationsManager.prototype.getEnabledConnections = function(params, callback) {
  return this.connections.getAll(params, callback);
};

/**
 * Get Enabled Connection in a Organization
 *
 * @method    getEnabledConnection
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * var params = {id : 'ORGANIZATION_ID', connection_id: 'CONNECTION_ID'}
 * @example <caption>
 *   This methods takes the organization ID and connection ID and returns the enabled connection
 * </caption>
 *
 * management.organizations.getEnabledConnections( {id : 'ORGANIZATION_ID', connection_id: 'CONNECTION_ID'}, function (err, enabled_connection) {
 *   console.log(enabled_connection);
 * });
 *
 * @param   {String}    [organization_id]   Organization ID
 * @param   {Function}  [cb]                Callback function.
 *
 * @return  {Promise|undefined}
 */
OrganizationsManager.prototype.getEnabledConnection = function(params, callback) {
  return this.connections.get(params, callback);
};

/**
 * Add enable a connection for an organization
 *
 * @method    addEnableConnection
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * var params =  { id :'ORGANIZATION_ID'};
 * var data = { "connection_id" : "CONNECTION_ID" };
 *
 * management.organizations.addEnableConnection(params, data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 * });
 *
 * @param   {String}    params.id             ID of the Organization.
 * @param   {Object}    data                  enable connection data
 * @param   {String}    data.connection_id    connection ID to enable
 * @param   {Boolean}   data.assign_membership_on_login flag to allow assign membership on login
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */

OrganizationsManager.prototype.addEnabledConnection = function(params, data, cb) {
  data = data || {};
  params = params || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The organizationId passed in params cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The organization Id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.connections.create(params, data, cb);
  }

  return this.connections.create(params, data);
};

/**
 * Remove an enabled connection from an organization
 *
 * @method    removePermissions
 * @memberOf  module:management.OrganizationsManager.prototype
 *
 * @example
 * var params =  { id :'ORGANIZATION_ID'};
 *
 * management.organizations.removeEnableConnection(params, data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 * });
 *
 * @param   {String}    params.id             ID of the Organization.
 * @param   {Object}    data                  permissions data
 * @param   {Function}  [cb]                  Callback function.
 *
 * @return  {Promise|undefined}
 */

OrganizationsManager.prototype.removeEnabledConnection = function(params, cb) {
  params = params || {};

  if (!params.id) {
    throw new ArgumentError('The organization ID passed in params cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The organization ID has to be a string');
  }

  if (!params.connection_id) {
    throw new ArgumentError('The connection ID passed in params cannot be null or undefined');
  }
  if (typeof params.connection_id !== 'string') {
    throw new ArgumentError('The connection ID has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.connections.delete(params, {}, cb);
  }

  return this.connections.delete(params, {});
};

module.exports = OrganizationsManager;
