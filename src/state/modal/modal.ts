import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ModalLevel {
	INFO = "info",
	WARNING = "warning",
	ERROR = "error",
	SUCCESS = "success",
}


/**
 * Set color and background color for each level
 */
const colorMap = new Map<string, string>();
const bgColorMap = new Map<string, string>();

colorMap.set("info", "#007bff");
colorMap.set("warning", "#ffc107");
colorMap.set("error", "#dc3545");
colorMap.set("success", "#28a745");

bgColorMap.set("info", "rgba(0, 123, 255, 0.1)");
bgColorMap.set("warning", "rgba(255, 193, 7, 0.1)");
bgColorMap.set("error", "rgba(220, 53, 69, 0.1)");
bgColorMap.set("success", "rgba(40, 167, 69, 0.1)");


interface initialType {
	show: boolean;
	message: string;
	title: string;
	level: ModalLevel;
}

const initialState: initialType = {
	show: false,
	message: "",
	title: "",
	level: ModalLevel.INFO,
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalShow: (state, action) => {
			state.show = action.payload;
		},
		setModalState: (state, action: PayloadAction<{ message: string; title: string; level: ModalLevel }>) => {
			state.message = action.payload.message;
			state.title = action.payload.title;
			state.level = action.payload.level;
		}
  },
});

export const { setModalShow, setModalState } = modalSlice.actions;
export default modalSlice.reducer;
export { colorMap, bgColorMap };