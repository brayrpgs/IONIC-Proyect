import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { addCircleOutline, closeCircleOutline } from 'ionicons/icons';
import "./CreateReview.css"
import { ReviewGet, SendReview } from '../../utils/Connections';


function CreateReview({ setData, data, gameId }: { setData: Dispatch<SetStateAction<ReviewGet[]>>, data: ReviewGet[], gameId: string }) {
    const modal = useRef<HTMLIonModalElement>(null);
    const reviewerName = useRef<HTMLIonInputElement>(null);
    const comment = useRef<HTMLIonInputElement>(null);
    const rating = useRef<HTMLIonInputElement>(null);
    const [isCompleted, setIsCompleted] = useState(true)
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isValid, setIsValid] = useState(true)
    const [isTouched, setIsTouched] = useState(false);

    const handlerSend = async () => {
        if (gameId
            && reviewerName.current?.value
            && comment.current?.value
            && rating.current?.value) {
            const result = await SendReview({
                "gameId": gameId,
                "reviewerName": reviewerName.current.value.toString(),
                "comment": comment.current.value.toString(),
                "rating": rating.current.value.toString(),
            })
            if (result) {
                setData([...data, result])
                setShowToast(true);
                setIsOpen(false)
                modal.current?.dismiss()
            }

        } else {
            console.log("error");

        }
    }

    return (
        <>
            <IonButton
                id="open-modal"
                expand="block"
                size='large'
                fill='outline'
                shape='round'
                onClick={(e) => {
                    (e.currentTarget as HTMLElement).blur();
                }}
                className='ion-button create'
            >
                Create
                <IonIcon slot="end" icon={addCircleOutline}></IonIcon>
            </IonButton>


            <IonModal
                className='ion-modal showContent'
                trigger="open-modal"
                onWillDismiss={() => { setIsOpen(false) }}
                isOpen={isOpen}
                ref={modal}
                showBackdrop={false}
            >
                <IonHeader>
                    <IonToolbar>

                        <IonButtons
                            slot="start">
                            <IonButton
                                onClick={(e) => {
                                    (e.currentTarget as HTMLElement).blur()
                                    setIsOpen(false)
                                    modal.current?.dismiss()
                                }}
                            >
                                Cancel
                            </IonButton>

                        </IonButtons>

                        <IonTitle className='title-modal'>Create a new review</IonTitle>

                        <IonButtons
                            slot="end"
                        >

                            <IonButton
                                strong={true}
                                onClick={handlerSend}
                                disabled={isCompleted}
                                
                            >
                                Confirm
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
                            placeholder="rating?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={rating}
                            helperText='Enter rating range of 1 between 5'
                            errorText='Value out range, please enter valid value'
                            className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                            onInput={(event) => {
                                const value = event.currentTarget.value
                                if (value && value as number >= 1 && value as number <= 5) {
                                    setIsValid(true)
                                    setIsTouched(false)
                                    setIsCompleted(false)
                                }
                                else{
                                    setIsValid(false)
                                    setIsTouched(true)
                                    setIsCompleted(true)
                                }
                            }}
                            onIonBlur={() => (
                                setIsTouched(true)
                            )}

                        />
                    </IonItem>
                </IonContent>
            </IonModal>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Game successfully created!"
                duration={2000}
                color="success"
                position="bottom"
            />
        </>
    );
}
export default CreateReview;