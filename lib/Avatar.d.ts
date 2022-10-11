import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const Avatar: import("styled-components").StyledComponent<"img", any, {
    /** Sets the width and height of the avatar. */
    size?: number | undefined;
    /** Sets the shape of the avatar to a square if true. If false, the avatar will be circular. */
    square?: boolean | undefined;
    /** URL of the avatar image. */
    src: string;
    /** Provide alt text when the Avatar is used without the user's name next to it. */
    alt?: string | undefined;
} & SxProp, never>;
export declare type AvatarProps = ComponentProps<typeof Avatar>;
export default Avatar;
