import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';

import './Tab1.css';
import { FetchGames, Games, URL_BASE } from '../utils/Connections';
import { useEffect, useState } from 'react';
import CreateGame from '../components/CreateGame';



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
            <CreateGame />
          </IonButtons>
          <IonTitle className='title-game'>Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen >
        <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
          handleFetchGames().then(() => (event.detail.complete()))
        }}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <p>Pull this content down to trigger the refresh.</p>
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
              </IonCardContent>
            </IonCard>
          ))
        }

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
