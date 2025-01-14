import {
  IonContent,
  IonIcon,
  IonPage,
  IonText,
  IonFabButton,
  IonCard,
  IonCardSubtitle,
  IonCardContent,
  IonCardHeader,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonThumbnail,
  useIonRouter,
} from "@ionic/react";
import { barcodeOutline, checkmarkOutline } from "ionicons/icons";
import "./StudentCard.css";
import sylLogo from "../assets/img/syl-logo.png";
import ythsLogo from "../assets/img/yths-logo.png";
import Profile from "../types/profile";

interface Props {
  profile: Profile;
}

export default function StudentCard({ profile }: Props) {
  const router = useIonRouter();

  const userInfoIsValid = () => {
    return !(Object.values(profile).includes("") || Object.values(profile).includes(null));
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar mode="ios" color="secondary">
          <IonTitle className="text-10 text-regular">OPISKELIJAKORTTI</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen color="secondary">
        {userInfoIsValid() ? (
          <div className="container px-2">
            <div className="student-card">
              <div style={{ position: "relative" }}>
                <div
                  className="force-square mx-2 mb-2"
                  style={{
                    backgroundImage: `url(${profile.picture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }}></div>
                <IonFabButton className="student-card-icon-left" style={{ pointerEvents: "none" }} color="light">
                  <IonIcon size="large" icon={barcodeOutline} />
                </IonFabButton>
                <IonFabButton
                  className="student-card-icon-right pulse"
                  color="light"
                  onClick={() => router.push("/card/verify")}>
                  <IonIcon size="large" icon={checkmarkOutline} />
                </IonFabButton>
              </div>
              <IonText color="light mb-1 color-lightgrey">
                <section className="pt-1">
                  <div className="text-15 text-upper-capitalize">{profile.firstName}</div>
                  <div className="text-15 text-upper-capitalize">{profile.lastName}</div>
                  <div>{profile.birthDate.split("-").reverse().join(".")}</div>
                </section>
                <section className="pt-1 flex space-between">
                  <div className="text-upper-capitalize truncate">{profile.university}</div>
                  <div className="flex flex-no-wrap">
                    <IonThumbnail>
                      <img src={sylLogo} alt="SYL logo" className="thumbnail" />
                    </IonThumbnail>
                    <IonThumbnail style={{ marginLeft: "0.25rem" }}>
                      <img src={ythsLogo} alt="SYL logo" className="thumbnail" />
                    </IonThumbnail>
                  </div>
                </section>
                <section className="pt-1">
                  {/* Looks like it's should say 'Korkeakouluopiskelija' for AMK & University */}
                  <div>
                    {profile.educationLevel == "Yliopisto" || profile.educationLevel == "Ammattikorkeakoulu"
                      ? "Korkeakouluopiskelija"
                      : profile.educationLevel}
                  </div>
                  <div>{profile.studentNumber}</div>
                </section>
              </IonText>
            </div>
          </div>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Syötä omat tiedot niin opiskelijakorttisi tulee näkyviin</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton onClick={() => router.push("/profile")}>Syötä tiedot</IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
}
