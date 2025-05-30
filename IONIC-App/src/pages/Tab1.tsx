import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToast, IonToolbar, RefresherEventDetail } from '@ionic/react';

import { FetchGames, Games, URL_BASE } from '../utils/Connections';
import { useEffect, useRef, useState } from 'react';
import CreateGame from '../components/games/CreateGame';
import "./Tab1.css"
import { createOutline, eyeOutline, trashOutline } from 'ionicons/icons';
import DeleteGameModal from '../components/games/DeleteGameModal';
import UpdateGameModal from '../components/games/UpdateGameModal';

const Tab1: React.FC = () => {
  const [data, setData] = useState<Games[]>([])
  const [gameToDelete, setGameToDelete] = useState<Games | null>(null);
  const [gameToUpdate, setGameToUpdate] = useState<Games | null>(null);
  const toast = useRef<HTMLIonToastElement>(null);

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
                      onClick={(e) => {
                        (e.currentTarget as HTMLElement).blur()
                        setGameToDelete(value)
                      }}
                    >
                      Delete
                      <IonIcon slot="end" icon={trashOutline}></IonIcon>
                    </IonButton>

                    <IonButton
                      fill='outline'
                      className='ion-button edit'
                      expand="block"
                      size='small'
                      shape='round'
                      onClick={(e) => {
                        (e.currentTarget as HTMLElement).blur()
                        setGameToUpdate(value)
                      }}
                    >
                      Edit game
                      <IonIcon slot="end" icon={createOutline}></IonIcon>
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

        <IonModal isOpen={gameToDelete !== null} onDidDismiss={() => setGameToDelete(null)}>
          {gameToDelete && (
            <DeleteGameModal
              gameId={gameToDelete.id.toString()}
              gameName={gameToDelete.title}
              onClose={() => {
                (document.activeElement as HTMLElement)?.blur();
                setGameToDelete(null);
              }}
              updateGames={handleFetchGames}
              toast={toast}
            />
          )}
        </IonModal>
        <IonModal isOpen={gameToUpdate !== null} onDidDismiss={() => setGameToUpdate(null)}>
          {gameToUpdate && (
            <UpdateGameModal
              game={gameToUpdate}
              onClose={() => {
                (document.activeElement as HTMLElement)?.blur();
                setGameToUpdate(null);
              }}
              updateGames={handleFetchGames}
              toast={toast}
            />
          )}
        </IonModal>

        <IonToast
          position="bottom"
          ref={toast}
        />
      </IonContent>
    </IonPage>

  );
};

export default Tab1;
