import { IonButton, IonText, IonToast } from "@ionic/react";
import "./DeleteGameModal.css";
import { RefObject, useState } from "react";
import { DeleteGame } from "../../utils/Connections";

interface DeleteConfirmModalProps {
    gameId: string | null;
    gameName: string | null;
    onClose: () => void;
    updateGames: () => void;
    setMessageToast: (message: string) => void;
    setShowToast: (showToast: boolean) => void;
    setColorToast: (colorToast: string) => void;
}

const DeleteGameModal: React.FC<DeleteConfirmModalProps> = ({ gameId, gameName, onClose, updateGames, setMessageToast, setShowToast, setColorToast }) => {

    async function deleteGame(gameId: string | null) {
        try {
            await DeleteGame(gameId as string);

            setMessageToast("Game successfully deleted!");
            setShowToast(true);
            setColorToast("success")

            onClose();
            updateGames();
        } catch (error: any) {

            setMessageToast("Cannot delete the game because it has associated reviews.");
            setShowToast(true);
            setColorToast("danger")

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
                        data-testid={`delete-confirm-button`}
                        expand="block"
                        shape="round"
                        onClick={(e) => {
                            (e.currentTarget as HTMLElement).blur()
                            deleteGame(gameId)
                        }}
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