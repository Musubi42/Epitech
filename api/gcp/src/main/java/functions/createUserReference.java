package functions;

import com.google.cloud.functions.Context;
import com.google.cloud.functions.RawBackgroundFunction;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.logging.Logger;
import java.util.concurrent.ExecutionException;
import java.lang.InterruptedException;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.*;
import com.google.firebase.cloud.FirestoreClient;
import java.util.Map;
import java.util.HashMap;

public class createUserReference implements RawBackgroundFunction {
  private static final Logger logger = Logger.getLogger(createUserReference.class.getName());
  private static final Gson gson = new Gson();
  private static final FirebaseApp App = FirebaseApp.initializeApp();

  @Override
  public void accept(String json, Context context) {
    JsonObject body = gson.fromJson(json, JsonObject.class);
    try {
        createReference(body.get("uid").getAsString(), body.get("displayName").getAsString(), body.get("email").getAsString());
        // sendEmail(body.get("uid").getAsString(), body.get("email").getAsString());
    } catch(InterruptedException e) {
        e.printStackTrace();
    } catch(ExecutionException e) {
        e.printStackTrace();
    }
  }

  public void createReference(String uid, String displayName, String email) throws InterruptedException, ExecutionException {
    Map<String, Object> Data = new HashMap<>();
    Data.put("displayName", displayName);
    Data.put("email", email);
    Data.put("disabled", false);
    Data.put("confirmation", false);
    Data.put("admin", false);
    FirebaseDatabase.getInstance("https://dashboard-81b3f-default-rtdb.europe-west1.firebasedatabase.app").getReference(uid).setValueAsync(Data).get();
  }

  public void sendEmail(String uid, String email) throws InterruptedException, ExecutionException {
    Map<String, Object> Email = new HashMap<>();
    Email.put("to", email);
    Map<String, Object> Template = new HashMap<>();
    Template.put("name", "confirmation");
    Map<String, Object> Data = new HashMap<>();
    Data.put("uid", uid);
    Template.put("data", Data);
    Email.put("template", Template);
    FirestoreClient.getFirestore().collection("mail").add(Email);
  }
  
}

// gcloud functions deploy createUserReference --entry-point functions.createUserReference --trigger-event providers/firebase.auth/eventTypes/user.create --trigger-resource dashboard-81b3f --runtime java17 --region=europe-west1 --service-account firebase-adminsdk-eut15@dashboard-81b3f.iam.gserviceaccount.com --set-env-vars '^@^FIREBASE_CONFIG={"projectId":"dashboard-81b3f","databaseURL":"https://dashboard-81b3f-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"dashboard-81b3f.appspot.com","locationId":"europe-west"}'