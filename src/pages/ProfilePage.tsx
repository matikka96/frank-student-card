import React, { ReactElement, useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonDatetime,
  IonAvatar,
  IonListHeader,
  IonIcon,
  useIonActionSheet,
} from "@ionic/react";
import { cloudUploadOutline } from "ionicons/icons";
import Schools from "../assets/data/schools.json";
import educationLevels from "../assets/data/educationLevels.json";
import "./Profile.css";
import Compressor from "compressorjs";
import Profile from "../types/profile"

interface Props {
  profile: Profile;
  setProfile: (newProfile: Profile) => void;
}

export default function ProfilePage({ profile, setProfile }: Props): ReactElement {
  const [sheetPresent, sheetDismiss] = useIonActionSheet();
  const [activeSchools, setActiveSchools] = useState<string[]>([]);

  useEffect(() => {
    const activeEduLvlSchools = getEduLvlSchools(profile.educationLevel);
    setActiveSchools(activeEduLvlSchools);
    if (!activeEduLvlSchools.includes(profile.university)) updateProfile("university", "");
  }, [profile.educationLevel]);

  const updateProfile = (key: string, value: string | number) => {
    const updatedProfile = JSON.parse(JSON.stringify(profile));
    updatedProfile[key] = value;
    setProfile(updatedProfile);
  };

  const loadPicture = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      new Compressor(file, {
        quality: 0.5,
        success: (compressedResult) => {
          let reader = new FileReader();
          reader.readAsDataURL(compressedResult);
          reader.onloadend = () => {
            let base64data = reader.result;
            if (base64data) updateProfile("picture", base64data.toString());
          };
        },
      });
    }
  };

  const getEduLvlSchools = (eduLvl: string) => {
    if (eduLvl && Schools) {
      const schoolLvl = educationLevels.find((lvl) => lvl.fi === eduLvl);
      if (schoolLvl) {
        const index = Object.keys(Schools).indexOf(schoolLvl.ref);
        if (index !== -1) {
          const eduLvlSchools = Object.values(Schools)[index];
          return eduLvlSchools.map((school) => school.name);
        } else return [];
      } else return [];
    } else return [];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle className="text-10 text-regular">Profiili</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label>
            <IonAvatar
              slot="center"
              className="m-2 bg-grey"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              {profile.picture ? <img src={profile.picture} /> : <IonIcon size="large" icon={cloudUploadOutline} />}
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => loadPicture(e)}
              />
            </IonAvatar>
          </label>
        </div>

        <IonList className="mb-1">
          <IonListHeader>
            <IonLabel>Opiskelijan tiedot</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel position="stacked">Etunimi</IonLabel>
            <IonInput
              value={profile.firstName}
              onIonChange={(e) => updateProfile("firstName", e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Sukunimi</IonLabel>
            <IonInput
              value={profile.lastName}
              onIonChange={(e) => updateProfile("lastName", e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Opiskelijanumero</IonLabel>
            <IonInput
              type="number"
              value={profile.studentNumber}
              onIonChange={(e) => updateProfile("studentNumber", e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Syntymäpäivä</IonLabel>
            <IonDatetime
              displayFormat="YYYY MM DD"
              min={(new Date().getFullYear() - 80).toString()}
              max={(new Date().getFullYear() - 15).toString()}
              value={profile.birthDate}
              onIonChange={(e) => updateProfile("birthDate", e.detail.value!.split("T")[0])}></IonDatetime>
          </IonItem>

          <IonItem
            onClick={() =>
              sheetPresent({
                header: "Koulutusaste",
                buttons: educationLevels
                  .map((lvl) => ({
                    text: lvl.fi,
                    role: profile.educationLevel === lvl.fi ? "selected" : undefined,
                    handler: () => updateProfile("educationLevel", lvl.fi),
                  }))
                  .concat([
                    {
                      text: "Peruuta",
                      role: "cancel",
                      handler: () => sheetDismiss,
                    },
                  ]),
              })
            }>
            <IonLabel position="stacked">Koulutusaste</IonLabel>
            <IonInput value={profile.educationLevel} readonly></IonInput>
          </IonItem>

          <IonItem
            disabled={activeSchools.length === 0 ? true : false}
            onClick={() =>
              sheetPresent({
                header: "Koulu",
                buttons: activeSchools
                  .map((school) => ({
                    text: school,
                    role: profile.university === school ? "selected" : undefined,
                    handler: () => updateProfile("university", school),
                  }))
                  .concat([
                    {
                      text: "Peruuta",
                      role: "cancel",
                      handler: () => sheetDismiss,
                    },
                  ]),
              })
            }>
            <IonLabel position="stacked">Koulu</IonLabel>
            <IonInput value={profile.university} readonly></IonInput>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
