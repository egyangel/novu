export enum HandlebarHelpersEnum {
  EQUALS = 'equals',
  TITLECASE = 'titlecase',
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  PLURALIZE = 'pluralize',
  DATEFORMAT = 'dateFormat',
  UNIQUE = 'unique',
  GROUP_BY = 'groupBy',
  SORT_BY = 'sortBy',
  NUMBERFORMAT = 'numberFormat',
  I18N = 'i18n',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  EQ = 'eq',
  NE = 'ne',
}

export const HandlebarHelpers = {
  [HandlebarHelpersEnum.EQUALS]: { description: 'assert equal' },
  [HandlebarHelpersEnum.TITLECASE]: { description: 'transform to TitleCase' },
  [HandlebarHelpersEnum.UPPERCASE]: { description: 'transform to UPPERCASE' },
  [HandlebarHelpersEnum.LOWERCASE]: { description: 'transform to lowercase' },
  [HandlebarHelpersEnum.PLURALIZE]: { description: 'pluralize if needed' },
  [HandlebarHelpersEnum.DATEFORMAT]: { description: 'format date' },
  [HandlebarHelpersEnum.UNIQUE]: { description: 'filter unique values in an array' },
  [HandlebarHelpersEnum.GROUP_BY]: { description: 'group by a property' },
  [HandlebarHelpersEnum.SORT_BY]: { description: 'sort an array of objects by a property' },
  [HandlebarHelpersEnum.NUMBERFORMAT]: { description: 'format number' },
  [HandlebarHelpersEnum.I18N]: { description: 'translate' },
  [HandlebarHelpersEnum.GT]: { description: 'greater than' },
  [HandlebarHelpersEnum.GTE]: { description: 'greater than or equal to' },
  [HandlebarHelpersEnum.LT]: { description: 'lesser than' },
  [HandlebarHelpersEnum.LTE]: { description: 'lesser than or equal to' },
  [HandlebarHelpersEnum.EQ]: { description: 'strict equal' },
  [HandlebarHelpersEnum.NE]: { description: 'strict not equal to' },
};
