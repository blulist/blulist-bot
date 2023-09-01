import { inlineCbKeys } from '../../shared/constants/callbacks.constant';

export const editPlaylistRegex = new RegExp(
  `^${inlineCbKeys.EDIT_PLAYLIST}:(.*)$`,
);

export const editPlaylistNameRegex = new RegExp(
  `^${inlineCbKeys.EDIT_PLAYLIST_NAME}:(.*)$`,
);
export const editPlaylistBannerRegex = new RegExp(
  `^${inlineCbKeys.EDIT_PLAYLIST_BANNER}:(.*)$`,
);
