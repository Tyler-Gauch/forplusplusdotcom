export const encodeTitleToId = title => {
    return title.toLowerCase().replace(/ /g, "-");
}