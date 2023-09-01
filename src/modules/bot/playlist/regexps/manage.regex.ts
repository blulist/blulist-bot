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
export const showMyPlaylistFiles = new RegExp(
  `^${inlineCbKeys.SHOW_MY_FILES}:(.*)$`,
);
