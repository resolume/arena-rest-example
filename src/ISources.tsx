export interface ISource {
    idstring: string,
    name: string,
    presets: string[],
}

export interface ISources {
    [key: string]: ISource[],
}

export default ISources;
