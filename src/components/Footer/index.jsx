import React from 'react';
import { withTranslation, useTranslation } from 'react-i18next';

function FooterComponent() {
  const { t } = useTranslation();
  return (
    <div className='footer'>
      <div className='container'>
        <div className='copyright'>{t('footer.copyright')}</div>
      </div>
    </div>
  );
}

export default withTranslation()(FooterComponent);
