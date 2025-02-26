import { Modal, Button } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { setModalShow } from "@/state/modal/modal";
import { colorMap, bgColorMap } from "@/state/modal/modal";

const Modals = () => {
	
	const { show, message, title, level } = useSelector((state: RootState) => state.modal);
	const dispatch = useDispatch();

	const handleClose = () => {
		dispatch(setModalShow(false));
	}

  return (
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
				centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
						<h3>
							{title}
						</h3>
					</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
					display: "flex",
					flexDirection: "column",
					alignContent: "center",
				}}>
					<p style={{
						marginBottom: "0",
						padding: "10px",
						borderRadius: "5px",
						backgroundColor: bgColorMap.get(level),
						color: colorMap.get(level),
					}} >{ message }</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default Modals;