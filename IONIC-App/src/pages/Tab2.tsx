import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToast, IonToolbar, RefresherEventDetail } from '@ionic/react';
import './Tab2.css';
import { useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { FetchReviewsById, ReviewGet, ReviewSend, ReviewUpdate } from '../utils/Connections';
import { createOutline, trashOutline } from 'ionicons/icons';
import CreateReview from '../components/reviews/CreateReview';
import DeleteReviewModal from '../components/reviews/DeleteReviewModal';
import UpdateReviewModal from '../components/reviews/UpdateReviewModal';

const Tab2: React.FC = () => {
  //
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const game = params.get('name');
  const [reviewToDelete, setReviewToDelete] = useState<ReviewGet | null>(null);
  const [reviewToUpdate, setReviewToUpdate] = useState<ReviewUpdate | null>(null);
  const toast = useRef<HTMLIonToastElement>(null);
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
                        setReviewToDelete(value)
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
                        (e.currentTarget as HTMLElement).blur();

                        const reviewUpdate: ReviewUpdate = {
                          id: value.id,
                          gameId: String(value.gameId),
                          reviewerName: value.reviewerName,
                          comment: value.comment,
                          rating: String(value.rating),
                        };

                        setReviewToUpdate(reviewUpdate);
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

        <IonModal isOpen={reviewToDelete !== null} onDidDismiss={() => setReviewToDelete(null)}>
          {reviewToDelete && (
            <DeleteReviewModal
              reviewId={reviewToDelete.id.toString()}
              onClose={() => {
                (document.activeElement as HTMLElement)?.blur();
                setReviewToDelete(null);
              }}
              updateReviews={() => handleFetchReviewById(id)}
              toast={toast}
            />
          )}
        </IonModal>
        <IonModal isOpen={reviewToUpdate !== null} onDidDismiss={() => setReviewToUpdate(null)}>
          {reviewToUpdate && (
            <UpdateReviewModal
              review={reviewToUpdate}
              onClose={() => {
                (document.activeElement as HTMLElement)?.blur();
                setReviewToUpdate(null);
              }}
              updateReviews={() => handleFetchReviewById(id)}
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

export default Tab2;
