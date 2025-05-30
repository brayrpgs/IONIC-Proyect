import { IonButton, IonText, IonToast } from "@ionic/react";
import "./DeleteReviewModal.css";
import { RefObject, useState } from "react";
import { DeleteReview } from "../../utils/Connections";

interface DeleteConfirmModalProps {
    reviewId: string | null;
    onClose: () => void;
    updateReviews: () => Promise<void>;
    toast: RefObject<HTMLIonToastElement | null>;
}

const DeleteReviewModal: React.FC<DeleteConfirmModalProps> = ({ reviewId, onClose, updateReviews, toast }) => {

    async function deleteReview(gameId: string | null) {
        try {
          await DeleteReview(gameId as string);
            
          if(toast.current) {
            toast.current.message = "Review successfully deleted!";
            toast.current.color = "success";
            toast.current.duration = 2000;
            toast.current.isOpen = true;
            toast.current.onDidDismiss = async () => {
                updateReviews();
                return { data: undefined, role: undefined }; 
            };
            await toast.current.present();
          }
          
          onClose();
          updateReviews();
        } catch (error: any) {
          
            console.error("Error deleting review:", error);
            
        }
      }

    return (
        <>
            <div className="delete-modal-container ion-padding">
                <h2 className="delete-warning-text ion-text-center">
                    Are you sure you want to delete this review?
                </h2>
            
                <div className="ion-margin-top ion-text-center">
                    <IonButton
                        color="danger"
                        expand="block"
                        shape="round"
                        onClick={(e) => {
                            (e.currentTarget as HTMLElement).blur()
                            deleteReview(reviewId!)}}
                    >
                        Delete
                    </IonButton>

                    <IonButton
                        color="primary"
                        expand="block"
                        shape="round"
                        fill="outline"
                        onClick={onClose}
                        className="ion-margin-top"
                    >
                        Cancel
                    </IonButton>
                </div>
            </div>
            
        </>
    );
}

export default DeleteReviewModal;