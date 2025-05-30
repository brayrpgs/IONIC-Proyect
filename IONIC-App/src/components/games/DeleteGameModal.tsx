import { IonButton, IonText, IonToast } from "@ionic/react";
import "./DeleteGameModal.css";
import { RefObject, useState } from "react";
import { DeleteGame } from "../../utils/Connections";

interface DeleteConfirmModalProps {
    gameId: string | null;
    gameName: string | null;
    onClose: () => void;
    updateGames: () => void;
    toast: RefObject<HTMLIonToastElement | null>;
}

const DeleteGameModal: React.FC<DeleteConfirmModalProps> = ({ gameId, gameName, onClose, updateGames, toast }) => {

    async function deleteGame(gameId: string | null) {
        try {
          await DeleteGame(gameId as string);
            
          if(toast.current) {
            toast.current.message = "Game successfully deleted!";
            toast.current.color = "success";
            toast.current.duration = 2000;
            toast.current.isOpen = true;
            toast.current.onDidDismiss = async () => {
                updateGames();
                return { data: undefined, role: undefined }; 
            };
            await toast.current.present();
          }
          
          onClose();
          updateGames();
        } catch (error: any) {
          
            if (toast.current) {
                toast.current.message = "Cannot delete the game because it has associated reviews.";
                toast.current.color = "danger";
                toast.current.duration = 2500;
                toast.current.isOpen = true;
                toast.current.onDidDismiss = async () => {
                    return { data: undefined, role: undefined }; 
                };
                await toast.current.present();
            }
            
        }
      }

    return (
        <>
            <div className="delete-modal-container ion-padding">
                <h2 className="delete-warning-text ion-text-center">
                    Are you sure you want to delete this game?
                </h2>
                <h3 className="ion-text-center">
                    {gameName}
                </h3>

                <div className="ion-margin-top ion-text-center">
                    <IonButton
                        color="danger"
                        expand="block"
                        shape="round"
                        onClick={(e) => {
                            (e.currentTarget as HTMLElement).blur()
                            deleteGame(gameId)}}
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

export default DeleteGameModal;