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

public class deleteUser implements RawBackgroundFunction {
  private static final Logger logger = Logger.getLogger(deleteUser.class.getName());
  private static final Gson gson = new Gson();
  private static final FirebaseApp App = FirebaseApp.initializeApp();

  @Override
  public void accept(String json, Context context) throws FirebaseAuthException {
    JsonObject body = gson.fromJson(json, JsonObject.class);
    FirebaseAuth.getInstance().deleteUser(context.resource().replace("projects/_/instances/dashboard-81b3f-default-rtdb/refs/",""));
  }
}

// gcloud functions deploy deleteUser --entry-point functions.deleteUser --trigger-event providers/google.firebase.database/eventTypes/ref.delete --trigger-resource projects/_/instances/dashboard-81b3f-default-rtdb/refs/{pushId} --runtime java17 --region=europe-west1 --service-account firebase-adminsdk-eut15@dashboard-81b3f.iam.gserviceaccount.com --set-env-vars '^@^FIREBASE_CONFIG={"projectId":"dashboard-81b3f","databaseURL":"https://dashboard-81b3f-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"dashboard-81b3f.appspot.com","locationId":"europe-west"}'
