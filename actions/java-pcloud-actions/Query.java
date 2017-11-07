import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.sql.*;
import com.mysql.jdbc.Driver;

public class Query {
	public static JsonObject main(JsonObject args) {

		JsonObject response = new JsonObject();
		String host = args.getAsJsonPrimitive("MYSQL_HOSTNAME").getAsString();
		String user = args.getAsJsonPrimitive("MYSQL_USERNAME").getAsString();
		String password = args.getAsJsonPrimitive("MYSQL_PASSWORD").getAsString();
		String database = args.getAsJsonPrimitive("MYSQL_DATABASE").getAsString();

		try {
			// create our mysql database connection
			String myDriver = "com.mysql.jdbc.Driver";
			String myUrl = "jdbc:mysql://"+host+"/cats?useSSL=false";
			Class.forName(myDriver);
			Connection conn = DriverManager.getConnection(myUrl, user, password);

			// our SQL SELECT query.
			// if you only need a few columns, specify them by name instead of
			// using "*"
			String query = getQuerystr();

			// create the java statement
			Statement st = conn.createStatement();

			// execute the query, and get a java resultset
			ResultSet rs = st.executeQuery(query);
			JsonElement results = resultSet2JsonElement(rs);
			if (results==null)
				response.addProperty("msg", "no results returned");
			else response.add("rows", results);
			response.addProperty("msg", "success");
			st.close();
			
		} catch (Exception e) {
			System.err.println("Got an exception! ");
                        e.printStackTrace();
			response.addProperty("msg","error");
		}

		return response;
	}
	
	private static String getQuerystr() {
	/*	return " SELECT DISTINCT " +
			       " APP.NAME AS app_name, " +
			       " COMP.NAME AS comp_name, " +
			       " COMP_ENV.ENVIROMENT_ID, " +
			       " APP.LAST_UPDATED_BY AS app_last_updated_by, " +
			       " COMP_ENV.LAST_UPDATED_DATE AS last_updated_date, " +
			       " COMP.developmode AS developmode, " +
			       " COMP.SUB_APP_TYPE AS subapp_type, " +
			       " ENV.ENV_ALIAS AS env_alias, " +
			       " APP.ID AS app_id, " +
			       " PROT.NAME AS profile_name, " +
			       " PROT.ID AS profileid, " +
			       " date_format (COMP_ENV.CREATED_DATE, '%Y-%m-%d') " + " AS apply_created_date, " +
			       " COMP_ENV.ID AS comp_id, " +
			       " VM.HOSTNAME AS hostname, " +
			       " VM.BUSINESSIP AS businessip, " +
			       " COMP_ENV.RSC_TYPE AS rsc_type, " +
			       " COMP.CONTEXT AS context " +
			       " FROM COMP_ENVIROMENT_T COMP_ENV " +
			        " INNER JOIN APPLICATION_T APP ON APP.ID = COMP_ENV.APPLICATION_ID " +
			       " INNER JOIN COMPONENT_T COMP ON COMP.ID = COMP_ENV.COMPONENT_ID " +
			       " INNER JOIN ENVIROMENT_T ENV ON ENV.ID = COMP_ENV.ENVIROMENT_ID " +
			       " LEFT JOIN COMPONENT_PROFILE_T COMP_PROFILE " +
			        "  ON COMP_ENV.ID = COMP_PROFILE.COMP_ENVIROMENT_ID " +
			       " LEFT JOIN PROFILE_T PROT ON PROT.ID = COMP_PROFILE.PROFILE_ID " +
			       " LEFT JOIN VIRTUAL_MACHINE_T VM ON VM.ID = PROT.VM_ID " +
			" ORDER BY APP.NAME, " +
			         " COMP.NAME, " +
			         " ENV.ENV_ALIAS, " +
			         " VM.HOSTNAME " +
			" limit 10 ";*/
             return "select * from pets";
	}
	
	private static JsonElement resultSet2JsonElement(ResultSet results) throws SQLException {
		int count = 0;
		JsonObject row = new JsonObject();
		JsonArray rows = new JsonArray();

		ResultSetMetaData rsmd = results.getMetaData();
		int numCols = rsmd.getColumnCount();

		while (results.next()) {
			count++;
			for (int i = 1; i <= numCols; i++) {
				String label = rsmd.getColumnName(i);
				String value = results.getString(i);
				row.addProperty(label, value);
			}
			rows.add(row);
		}

		if (count == 0)
			return null;
		else if (count == 1)
			return row;
		else
			return rows;
	}

}
