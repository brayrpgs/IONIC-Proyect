import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';

import { FetchGames, Games, URL_BASE } from '../utils/Connections';
import { useEffect, useState } from 'react';
import CreateGame from '../components/CreateGame';
import "./Tab1.css"
import { eyeOutline, trashOutline } from 'ionicons/icons';


const Tab1: React.FC = () => {
  const [data, setData] = useState<Games[]>([])
  async function handleFetchGames() {
    setData(await FetchGames())
  }
  useEffect(() => {
    handleFetchGames()
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <CreateGame data={data} setData={setData} />
          </IonButtons>
          <IonTitle className='.io-title title-game'>Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen >
        <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
          handleFetchGames().then(() => (event.detail.complete()))
        }}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonItem>
          <p>Pull this content down to trigger the refresh.</p>
        </IonItem>
        {
          data.map((value, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>🎮 {value.title}</IonCardTitle>
                <IonCardSubtitle>🎭 Genre: {value.genre}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td><strong>🕹️ Platform:</strong></td>
                      <td>{value.platform}</td>
                    </tr>
                    <tr>
                      <td><strong>⏱️ Hours Played:</strong></td>
                      <td>{value.hoursPlayed} hrs</td>
                    </tr>
                    <tr>
                      <td><strong>{value.isCompleted ? "✅ Completed" : "❌ Completed"}</strong></td>
                      <td>{value.isCompleted ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td><strong>🤓 Game Number:</strong></td>
                      <td>{index + 1}</td>
                    </tr>
                    <tr>
                      <td><strong>🖼️ Image:</strong></td>
                      <td>
                        <img
                          src={URL_BASE + value.imageUrl}
                          alt={value.title}
                          style={{ width: "100px", borderRadius: "8px" }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <IonGrid >
                  <IonRow >
                    <IonButton
                      fill='outline'
                      className='ion-button delete'
                      expand="block"
                      size='small'
                      shape='round'
                    >
                      Delete
                      <IonIcon slot="end" icon={trashOutline}></IonIcon>
                    </IonButton>
                    <IonButton
                      fill='outline'
                      className='ion-button show'
                      expand="block"
                      size='small'
                      shape='round'
                    >
                      Show Reviews
                      <IonIcon slot="end" icon={eyeOutline}></IonIcon>
                    </IonButton>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))
        }

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
