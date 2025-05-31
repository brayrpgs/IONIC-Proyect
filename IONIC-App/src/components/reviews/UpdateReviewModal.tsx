import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonModal, IonText, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { DeleteGame, Games, ReviewGet, ReviewUpdate, UpdateGame, UpdateReview } from "../../utils/Connections";
import { closeCircleOutline } from "ionicons/icons";

interface UpdateConfirmModalProps {
    review: ReviewUpdate | null;
    onClose: () => void;
    updateReviews: () => void;
    toast: React.RefObject<HTMLIonToastElement | null>;
}

const UpdateReviewModal: React.FC<UpdateConfirmModalProps> = ({ review, onClose, updateReviews, toast }) => {

    const reviewerName = useRef<HTMLIonInputElement>(null);
    const comment = useRef<HTMLIonInputElement>(null);
    const rating = useRef<HTMLIonInputElement>(null);

    const showToast = async (
        message: string,
        color: "success" | "warning" | "danger",
        duration = 2000
    ) => {
        if (!toast.current) return;
        toast.current.message = message;
        toast.current.color = color;
        toast.current.duration = duration;
        toast.current.isOpen = true;
        toast.current.onDidDismiss = async () => ({ data: undefined, role: undefined });
        await toast.current.present();
    };

    useEffect(() => {
        if (reviewerName.current) {
          reviewerName.current.value = review?.reviewerName || '';
          comment.current!.value = review?.comment || '';
          rating.current!.value = review?.rating || '';
        }
      }, [review]);

    async function handleUpdate() {

        try {
            if (reviewerName.current?.value && comment.current?.value
                && rating.current?.value) {
                
                    if (Number(rating.current.value) < 1 || Number(rating.current.value) > 5) {
                        await showToast(
                            "Rating must be between 1 and 5.",
                            "warning"
                        );
                        return;
                    }

                await UpdateReview({
                    id: review?.id || 0,
                    gameId: review?.gameId || "",
                    reviewerName: reviewerName.current!.value?.toString() || "",
                    comment: comment.current!.value?.toString() || "",
                    rating: rating.current!.value?.toString() || ""
                });

                await showToast("Review successfully updated!", "success");

                onClose();
                updateReviews();

            } else {
                await showToast(
                    "Please complete all required fields.",
                    "warning"
                );

            }
        } catch (error: any) {
            console.error("Error updating review:", error);
        }
    }

    return (
        <>
            <IonModal
                className='ion-modal showContent'
                isOpen={true}
                showBackdrop={false}
            >
                <IonHeader>
                    <IonToolbar>

                        <IonButtons
                            slot="start">

                            <IonButton
                                onClick={(e) => {
                                    (e.currentTarget as HTMLElement).blur()
                                    onClose();
                                }}
                            >
                                Cancel
                            </IonButton>

                        </IonButtons>

                        <IonTitle className='title-modal'>Update review</IonTitle>

                        <IonButtons
                            slot="end"
                        >

                            <IonButton
                                strong={true}
                                onClick={(e) => {
                                    (e.currentTarget as HTMLElement).blur()
                                    handleUpdate();
                                }}
                            >
                                Update
                            </IonButton>

                        </IonButtons>

                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-content showContent">
                    <IonItem >
                        <IonInput
                            label="Reviewer Name"
                            labelPlacement="floating"
                            type="text"
                            value={review?.reviewerName || ''}
                            placeholder="Your name?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={reviewerName}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Comment"
                            labelPlacement="floating"
                            type="text"
                            value={review?.comment || ''}
                            placeholder="Comment of game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={comment}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="rating"
                            labelPlacement="floating"
                            type="number"
                            min={"1"}
                            max={"5"}
                            value={review?.rating || ''}
                            placeholder="rating?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={rating}
                            helperText='Enter rating range of 1 between 5'
                            errorText='Value out range, please enter valid value'

                        />
                    </IonItem>
                </IonContent>
            </IonModal>

        </>
    );
}

export default UpdateReviewModal;