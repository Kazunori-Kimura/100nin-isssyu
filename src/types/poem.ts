export default interface PoemInfo {
    id: number;
    // 歌
    poem: string;
    // 読み人
    poet: string;
    // 読み人 (ひらがな)
    poet_kana: string;
    // 上の句 (ひらがな)
    above: string;
    // 下の句 (ひらがな)
    below: string;
}