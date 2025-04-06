export interface IPostion {
    x: number,
    y: number
}

export interface IMarker {
    id: string,
    position: IPostion,
    text?: string
}

export type IMarkerForm = Omit<IMarker, "id">
