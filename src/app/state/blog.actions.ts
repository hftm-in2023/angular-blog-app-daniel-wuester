export const BlogActions = {
  load: '[Blog] Load',
  loadSuccess: '[Blog] Load Success',
  loadFailure: '[Blog] Load Failure',
  add: '[Blog] Add',
  update: '[Blog] Update',
  remove: '[Blog] Remove',
} as const;

export type BlogActionType = (typeof BlogActions)[keyof typeof BlogActions];

export interface LoadAction {
  type: typeof BlogActions.load;
}
export interface LoadSuccessAction<T> {
  type: typeof BlogActions.loadSuccess;
  payload: T[];
}
export interface LoadFailureAction {
  type: typeof BlogActions.loadFailure;
  error: string;
}
export interface AddAction<T> {
  type: typeof BlogActions.add;
  payload: T;
}
export interface UpdateAction<T> {
  type: typeof BlogActions.update;
  payload: T;
}
export interface RemoveAction {
  type: typeof BlogActions.remove;
  payload: string | number;
}

export type BlogAction<T> =
  | LoadAction
  | LoadSuccessAction<T>
  | LoadFailureAction
  | AddAction<T>
  | UpdateAction<T>
  | RemoveAction;
