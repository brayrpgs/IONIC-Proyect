import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import './Tab2.css';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { FetchReviewsById, ReviewGet } from '../utils/Connections';
import { createOutline, trashOutline } from 'ionicons/icons';
import CreateReview from '../components/reviews/CreateReview';

const Tab2: React.FC = () => {
  //
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [isCompleted, setIsCompleted] = useState(true)  
  const id = params.get('id');
  const game = params.get('name');
  //

  //
  const [data, setData] = useState<ReviewGet[]>([]);

  async function handleFetchReviewById(id: string | null) {
    if (id !== null) {
      setData(await FetchReviewsById(id))
    }
  }

  useEffect(() => {
    handleFetchReviewById(id)
  }, [id])

  //

  const Ratings = [
    "⭐",
    "⭐⭐",
    "⭐⭐⭐",
    "⭐⭐⭐⭐",
    "⭐⭐⭐⭐⭐"
  ]


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <CreateReview data={data} setData={setData} gameId={id!} />
          </IonButtons>
          <IonTitle>Reviews {game}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">

        <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
          handleFetchReviewById(id).then(() => (event.detail.complete()))
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
                <IonCardTitle>📖 {value.reviewerName}</IonCardTitle>
                <IonCardSubtitle>🤳🏻 commented: {value.comment}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td><strong>🌟 Rating:</strong></td>
                      <td>{Ratings[value.rating - 1]}</td>
                    </tr>
                    <tr>
                      <td><strong>📅 Date commented:</strong></td>
                      <td>{new Date(value.reviewDate).toDateString()}</td>
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
                      }}
                    >
                      Edit review
                      <IonIcon slot="end" icon={createOutline}></IonIcon>
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

export default Tab2;
