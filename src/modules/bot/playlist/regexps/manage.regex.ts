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
export const editPlaylistStatusRegex = new RegExp(
  `^${inlineCbKeys.TOGGLE_PLAYLIST_STATUS}:(.*)$`,
);
export const backToMainPlaylistRegex = new RegExp(`backTo:mainPlaylist:(.*)$`);
export const showMyPlaylistFilesRegex = new RegExp(
  `^${inlineCbKeys.SHOW_MY_FILES}:(.*)$`,
);
export const sharePlaylistRegex = new RegExp(
  `^${inlineCbKeys.SHARE_PLAYLIST}:(.*)$`,
);
