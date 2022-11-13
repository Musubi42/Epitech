package functions;

import com.google.cloud.functions.Context;
import com.google.cloud.functions.RawBackgroundFunction;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.logging.Logger;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.*;
import com.google.firebase.auth.FirebaseAuthException;

public class disableUser implements RawBackgroundFunction {
  private static final Logger logger = Logger.getLogger(disableUser.class.getName());
  private static final Gson gson = new Gson();
  private static final FirebaseApp App = FirebaseApp.initializeApp();

  @Override
  public void accept(String json, Context context) throws FirebaseAuthException {
    JsonObject body = gson.fromJson(json, JsonObject.class);
    UpdateRequest Request = new UpdateRequest(context.resource().replace("projects/_/instances/dashboard-81b3f-default-rtdb/refs/","").replace("/disabled",""))
    .setDisabled(body.get("delta").getAsBoolean());
    FirebaseAuth.getInstance().updateUser(Request);
  }
}

// gcloud functions deploy disableUser --entry-point functions.disableUser --trigger-event providers/google.firebase.database/eventTypes/ref.update --trigger-resource projects/_/instances/dashboard-81b3f-default-rtdb/refs/{pushId}/disabled --runtime java17 --region=europe-west1 --service-account firebase-adminsdk-eut15@dashboard-81b3f.iam.gserviceaccount.com --set-env-vars '^@^FIREBASE_CONFIG={"projectId":"dashboard-81b3f","databaseURL":"https://dashboard-81b3f-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"dashboard-81b3f.appspot.com","locationId":"europe-west"}'