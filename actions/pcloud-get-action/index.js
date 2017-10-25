/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * This action gets a Cat by ID from a MySQL database
 *
 * @param   params.MYSQL_HOSTNAME    MySQL hostname
 * @param   params.MYSQL_USERNAME    MySQL username
 * @param   params.MYSQL_PASSWORD    MySQL password
 * @param   params.MYSQL_DATABASE    MySQL database
 * @param   params.id                ID of the cat to return

 * @return  Promise for the MySQL result
 */
function myAction(params) {

  return new Promise(function(resolve, reject) {
    console.log('Connecting to MySQL database');
    var mysql = require('promise-mysql');
    var connection;
    mysql.createConnection({
      host: params.MYSQL_HOSTNAME,
      user: params.MYSQL_USERNAME,
      password: params.MYSQL_PASSWORD,
      database: params.MYSQL_DATABASE
    }).then(function(conn) {
      connection = conn;
      console.log('Querying');
/**
 *      var queryText = 'SELECT * FROM cats WHERE id=?';
 *      var result = connection.query(queryText, [params.id]);
 */
      var queryText = ' SELECT DISTINCT ' +
       ' APP.NAME AS app_name, ' +
       ' COMP.NAME AS comp_name, ' +
       ' COMP_ENV.ENVIROMENT_ID, ' +
       ' APP.LAST_UPDATED_BY AS app_last_updated_by, ' +
       ' COMP_ENV.LAST_UPDATED_DATE AS last_updated_date, ' +
       ' COMP.developmode AS developmode, ' +
       ' COMP.SUB_APP_TYPE AS subapp_type, ' +
       ' ENV.ENV_ALIAS AS env_alias, ' +
       ' decode (COMP_ENV.apply_type, ' +
              ' \'grey\', ' +
               ' \'Grey\', ' +
               ' \'dr\', ' +
               ' \'Dr\', ' +
               ' \'grey_dr\', ' +
               ' \'Grey_Dr\', ' +
               ' \'Normal\') ' +
          ' AS apply_type, ' +
       ' APP.ID AS app_id, ' +
       ' PROT.NAME AS profile_name, ' +
       ' PROT.ID AS profileid, ' +
       ' TO_CHAR (COMP_ENV.CREATED_DATE, \'yyyy-MM-dd HH24:mi:ss\') ' +
          ' AS apply_created_date, ' +
       ' COMP_ENV.ID AS comp_id, ' +
       ' VM.HOSTNAME AS hostname, ' +
       ' VM.BUSINESSIP AS businessip, ' +
       ' COMP_ENV.RSC_TYPE AS rsc_type, ' +
       ' COMP.CONTEXT AS context, ' +
       ' CASE lower ( ' +
               ' xmlcast ( ' +
                  ' xmlquery (\'$xml/profile/product/text()\' ' +
                            ' PASSING prot.property AS \'xml\') AS VARCHAR (2000))) ' +
          ' WHEN \'tomcat\' ' +
          ' THEN ' +
             ' xmlcast ( ' +
                ' xmlquery (\'$xml/profile/defaultPort/text()\' ' +
                          ' PASSING prot.property AS \'xml\') AS VARCHAR (2000)) ' +
          ' WHEN \'was\' ' +
          ' THEN ' +
             ' xmlcast ( ' +
                ' xmlquery (\'$xml/profile/wasDefaultPort/text()\' ' +
                          ' PASSING prot.property AS \'xml\') AS VARCHAR (2000)) ' +
           ' ELSE ' +
             ' prot.ports ' +
       ' END ' +
         ' AS ports ' +
  ' FROM COMP_ENVIROMENT_T COMP_ENV ' +
        ' INNER JOIN APPLICATION_T APP ON APP.ID = COMP_ENV.APPLICATION_ID ' +
       ' INNER JOIN COMPONENT_T COMP ON COMP.ID = COMP_ENV.COMPONENT_ID ' +
       ' INNER JOIN ENVIROMENT_T ENV ON ENV.ID = COMP_ENV.ENVIROMENT_ID ' +
       ' LEFT JOIN COMPONENT_PROFILE_T COMP_PROFILE ' +
        '  ON COMP_ENV.ID = COMP_PROFILE.COMP_ENVIROMENT_ID ' +
       ' LEFT JOIN PROFILE_T PROT ON PROT.ID = COMP_PROFILE.PROFILE_ID ' +
       ' LEFT JOIN VIRTUAL_MACHINE_T VM ON VM.ID = PROT.VM_ID ' +
' ORDER BY APP.NAME, ' +
         ' COMP.NAME, ' +
         ' ENV.ENV_ALIAS, ' +
         ' VM.HOSTNAME ';
      var result = connection.query(queryText);
      connection.end();      
      return result;
    }).then(function(result) {
      console.log(result);
      if (result) {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: result
        });
      } else {
        reject({
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 404,
          body: {
            error: "Not found."
          }
        });
      }
    }).catch(function(error) {
      if (connection && connection.end) connection.end();
      console.log(error);
      reject({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 500,
        body: {
          error: "Error."
        }
      });
    });
  });

}

exports.main = myAction;
