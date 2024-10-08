import { novuInAppConfig } from '../credentials';

import { InAppProviderIdEnum } from '../provider.enum';
import { IProviderConfig } from '../provider.interface';

import { ChannelTypeEnum } from '../../../types';
import { UTM_CAMPAIGN_QUERY_PARAM } from '../../../ui';

export const inAppProviders: IProviderConfig[] = [
  {
    id: InAppProviderIdEnum.Novu,
    displayName: 'Novu Inbox',
    channel: ChannelTypeEnum.IN_APP,
    credentials: novuInAppConfig,
    docReference: `https://docs.novu.co/inbox/introduction${UTM_CAMPAIGN_QUERY_PARAM}`,
    logoFileName: { light: 'novu.png', dark: 'novu.png' },
  },
];
