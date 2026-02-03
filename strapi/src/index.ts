import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Add Vietnamese locale if it doesn't exist
    const localeService = strapi.plugin('i18n')?.service('locales');

    if (localeService) {
      const existingLocales = await localeService.find();
      const hasVietnamese = existingLocales.some(
        (locale: { code: string }) => locale.code === 'vi'
      );

      if (!hasVietnamese) {
        await localeService.create({
          code: 'vi',
          name: 'Vietnamese (Việt Nam)',
          isDefault: false,
        });
        console.log('✅ Vietnamese locale added');
      }
    }
  },
};
