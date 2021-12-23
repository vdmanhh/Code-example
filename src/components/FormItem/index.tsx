/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Input, Select, Switch, DatePicker } from 'antd';
import cx from 'classnames';
import {
  ErrorMessage,
  Field,
  FieldConfig,
  FieldInputProps,
  FormikProps,
} from 'formik';
import { isNil, trim } from 'lodash';
import { Moment } from 'moment';
import React, { FC, Fragment, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n/i18n';

import EyeIcon from 'resources/svg/eye.svg';
import EyeInvisibleIcon from 'resources/svg/eye_invisible.svg';

import NumberFormat from 'components/NumberFormat';

import { FORMAT_DATE_DMY, MAX_LENGTH_INPUT, TYPE_INPUT } from 'common/constant';
import { passwordStrength } from 'utils';

const { Password, Search, TextArea } = Input;
const { Option } = Select;

const levelPassword = [
  { level: 0, text: 'common.low' },
  { level: 1, text: 'common.low' },
  { level: 2, text: 'common.medium' },
  { level: 3, text: 'common.high' },
  { level: 4, text: 'common.high' },
];

export const TextInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  value?: any;
  maxLength?: number;
}> = ({ field, form, value, maxLength, ...props }) => {
  const { onChange, onBlur } = props as any;

  const maxLengthInput = maxLength || MAX_LENGTH_INPUT;

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange(e);
    }
  };

  const handleBlur = (e: any) => {
    const { value } = e.target;
    if (!onBlur) {
      form.handleBlur(e);
      form.setFieldValue(field.name, trim(value));
    } else {
      onBlur(e);
    }
  };

  return (
    <Input
      maxLength={maxLengthInput}
      {...field}
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
      value={!isNil(value) ? value : field.value}
    />
  );
};

export const NumberInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  unit: string;
  thousandSeparator?: boolean;
  onChange?: any;
  onValueChange?: any;
}> = ({
  field,
  form,
  unit,
  thousandSeparator,
  onChange,
  onValueChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<any>) => {
    if (thousandSeparator) {
      return;
    } else {
      field.onChange(e);
    }
  };

  const handleValueChange = (values: any) => {
    if (thousandSeparator) {
      form.setFieldValue(field.name, values?.value);
    }
  };

  return (
    <Fragment>
      <NumberFormat
        allowNegative={false}
        customInput={Input}
        thousandSeparator={thousandSeparator}
        onValueChange={onValueChange ?? handleValueChange}
        {...field}
        {...props}
        onChange={onChange ?? handleChange}
      />
      {unit && <span className='unit'>{unit}</span>}
    </Fragment>
  );
};

export const InputTextArea: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  maxLength?: number;
  props: any;
}> = ({ maxLength, field, form, ...props }) => {
  const maxLengthTextarea = maxLength || MAX_LENGTH_INPUT;
  return <TextArea maxLength={maxLengthTextarea} {...field} {...props} />;
};

export const SearchInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  maxLength?: number;
}> = ({ field, form, maxLength, ...props }) => {
  console.log(field);
  const { onChange, onBlur, onSearch } = props as any;

  const maxLengthInput = maxLength || MAX_LENGTH_INPUT;

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange(e);
    }
  };

  const handleBlur = (e: any) => {
    const { value } = e.target;
    if (!onBlur) {
      form.handleBlur(e);
      form.setFieldValue(field.name, trim(value));
    } else {
      onBlur(e);
    }
  };

  const handleSearch = (value: any) => {
    form.setFieldValue(field.name, trim(value));

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Search
      {...field}
      {...props}
      onSearch={handleSearch}
      onChange={handleChange}
      onBlur={handleBlur}
      value={field.value}
      maxLength={maxLengthInput}
    />
  );
};

export const PasswordInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  showLevelPassword?: boolean;
  label?: any;
  labelClassName?: string;
  form: FormikProps<any>;
}> = ({ field, showLevelPassword, label, labelClassName, form, ...props }) => {
  const fieldVal = field.value;
  const addClassLevel =
    passwordStrength(fieldVal) < 2
      ? 'input__label--low'
      : passwordStrength(fieldVal) < 3
      ? 'input__label--medium'
      : passwordStrength(fieldVal) < 5
      ? 'input__label--high'
      : '';
  const { t } = useTranslation('common');
  return (
    <>
      {label && (
        <div className={cx('form-item__label', labelClassName)}>
          {label}
          {!!fieldVal && !!showLevelPassword && (
            <div className='input__label--level'>
              {levelPassword.map((item) => (
                <span
                  className={`input__label--level-item ${
                    item.level <= passwordStrength(fieldVal) && addClassLevel
                  }`}
                  key={item.level}
                />
              ))}
              <span className={`input__label--level-title ${addClassLevel}`}>
                {t(
                  levelPassword.filter(
                    (item) => item.level === passwordStrength(fieldVal)
                  )[0]?.text
                )}
              </span>
            </div>
          )}
        </div>
      )}
      <Password
        iconRender={(visible) =>
          !visible ? (
            <img src={EyeInvisibleIcon} alt='invisible-eye' />
          ) : (
            <img src={EyeIcon} alt='eye' />
          )
        }
        {...field}
        {...props}
      />
    </>
  );
};

export const SelectInput: FC<{
  field: FieldInputProps<any>;
  props: FieldConfig;
  form: FormikProps<any>;
  options: {
    value: any;
    name: any;
  }[];
  prefix?: any;
  className?: string;
  onChange?: any;
  mode?: any;
  values?: any;
  optionsType?: any;
  enableAllOption?: any;
  renderOption?: any;
}> = ({
  field,
  form,
  options,
  prefix,
  className,
  onChange,
  optionsType,
  enableAllOption,
  renderOption,
  ...props
}) => {
  const ALL_OPTIONS = 'all-options';
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const { value } = field;

  useEffect(() => {
    setIndeterminate(
      !!value && !!value.length && value.length < options.length
    );
    setCheckAll(!!value && !!value.length && value.length === options.length);
  }, [value, options.length]);

  const tagRender = (props: any) => {
    const { label } = props;
    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <div className='search-form__select-item--multiple'>{label}, &nbsp;</div>
    );
  };

  const onCheckAllOptions = (event: any) => {
    const { checked } = event.target;
    let values = [];
    if (checked) {
      values = options.map((option) => option.value);
    } else {
      values = [];
    }
    setIndeterminate(false);
    setCheckAll(checked);
    onChangeSelect(values);
  };

  const optionsSelectAllRender = () => {
    switch (optionsType) {
      case TYPE_INPUT.CHECKBOX: {
        return (
          <div className='search-form__all-options'>
            <Checkbox
              onChange={onCheckAllOptions}
              id={ALL_OPTIONS}
              indeterminate={indeterminate}
              checked={checkAll}
            >
              {i18n?.t('common.all')}
            </Checkbox>
          </div>
        );
      }
      default: {
        return null;
      }
    }
  };

  const optionsRender = (item: any) => {
    switch (optionsType) {
      case TYPE_INPUT.CHECKBOX: {
        return (
          <Checkbox
            id={item.value}
            checked={value && value.indexOf(item.value) >= 0}
          >
            <div onClick={onPreventMouseDown}>{item.name}</div>
          </Checkbox>
        );
      }
      default: {
        return item.name;
      }
    }
  };

  const onPreventMouseDown = (event: any) => {
    event.stopPropagation();
  };

  const onChangeSelect = (val: any) => {
    if (onChange) {
      onChange({ form, field, val });
    } else {
      form.setFieldValue(field.name, val);
    }
  };

  return (
    <div className={className}>
      {prefix}
      <Select
        {...field}
        {...props}
        onChange={onChangeSelect}
        tagRender={tagRender}
        notFoundContent={
          <div className='ant-empty-text'>
            <img src={''} alt='No Data' />
            <p>{i18n?.t('common.no_data')}</p>
          </div>
        }
        // suffixIcon={<IconArrowDown />}
        dropdownRender={(menu) => {
          return (
            <Fragment>
              {enableAllOption &&
                options.length > 1 &&
                optionsSelectAllRender()}
              {menu}
            </Fragment>
          );
        }}
      >
        {options.map((item) => (
          <Option value={item.value} key={item.value} label={item.name}>
            {renderOption ? renderOption(item) : optionsRender(item)}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export const CheckboxInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  content: any;
}> = ({ field, content, form, ...props }) => (
  <Checkbox {...field} {...props} checked={field.value}>
    {content}
  </Checkbox>
);

export const SwitchInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
}> = ({ field, form, ...props }) => {
  const onChange = (checked: boolean) => {
    form.setFieldValue(field.name, checked);
  };
  return (
    <Switch {...field} {...props} checked={!!field.value} onChange={onChange} />
  );
};

export const DatePickerInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  readOnly?: boolean;
  value?: any;
}> = ({ field, form, readOnly = true, value, ...props }) => {
  const { onChange, disabledDate } = props as any;

  const handleDisabledDate = (current: Moment) => {
    if (disabledDate) {
      return disabledDate(current, form);
    }

    return false;
  };

  const handleChange = (value: any) => {
    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange({ form, field, value });
    }
  };

  return (
    <DatePicker
      {...field}
      {...props}
      onChange={handleChange}
      value={value || field.value}
      format={FORMAT_DATE_DMY}
      disabledDate={handleDisabledDate}
      inputReadOnly={readOnly}
      // suffixIcon={<IconCalendar />}
    />
  );
};

type FormItemType = {
  component?: any;
  type?: string;
  name: string;
  typeInput?: string | null;
  prefix?: any;
  suffix?: any;
  placeholder?: any;
  options?: {
    value: any;
    name: any;
  }[];
  dropdownClassName?: string;
  className?: string;
  content?: any;
  label?: any;
  showLevelPassword?: boolean;
  maxLength?: number;
  onChange?: any;
  showSearch?: boolean;
  filterOption?: any;
  dropdownMatchSelectWidth?: any;
  labelClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  decimalScale?: number;
  autoFocus?: boolean;
  required?: boolean;
  children?: any;
  inputProps?: any;
  mode?: any;
  showArrow?: any;
  maxTagCount?: any;
  maxTagTextLength?: any;
  onSearch?: any;
  tagRender?: any;
  optionLabelProp?: any;
  values?: any;
  optionsType?: any;
  enableAllOption?: any;
  errorField?: string;
  description?: any;
  fetchData?: any;
  renderOption?: any;
  limit?: string | number;
  getPopupContainer?: any;
  value?: any;
  disabled?: boolean;
  unit?: string;
  thousandSeparator?: boolean;
  onValueChange?: any;
  onBlur?: any;
  isAllowed?: any;
  enterButton?: any;
  virtual?: boolean;
  rows?: number;
  disabledDate?: any;
  fixedDecimalScale?: boolean;
  isNumericString?: boolean;
  onPressEnter?: any;
  allowClear?: boolean;
};

const FormItem = ({
  component,
  placeholder,
  type,
  name,
  typeInput = TYPE_INPUT.TEXT,
  prefix,
  options,
  dropdownClassName,
  className,
  content,
  label,
  labelClassName,
  containerClassName,
  errorClassName,
  required,
  children,
  errorField,
  description,
  disabled,
  unit,
  onPressEnter,
  ...props
}: FormItemType) => {
  let componentRender: any = component || TextInput;

  switch (typeInput) {
    case TYPE_INPUT.TEXT:
      componentRender = TextInput;
      break;
    case TYPE_INPUT.TEXTAREA:
      componentRender = InputTextArea;
      break;
    case TYPE_INPUT.PASSWORD:
      componentRender = PasswordInput;
      break;
    case TYPE_INPUT.SELECT:
      componentRender = SelectInput;
      break;
    case TYPE_INPUT.CHECKBOX:
      componentRender = CheckboxInput;
      break;
    case TYPE_INPUT.NUMBER:
      componentRender = NumberInput;
      break;
    case TYPE_INPUT.SEARCH:
      componentRender = SearchInput;
      break;
    case TYPE_INPUT.SWITCH:
      componentRender = SwitchInput;
      break;
    case TYPE_INPUT.DATE:
      componentRender = DatePickerInput;
      break;
  }
  const propsField: any = {
    prefix,
    placeholder,
    options,
    className,
    content,
    disabled,
    ...props,
  };
  if (
    typeInput === TYPE_INPUT.SELECT ||
    typeInput === TYPE_INPUT.SELECT_INFINITY_SCROLL
  ) {
    propsField.dropdownClassName = dropdownClassName;
  }
  if (typeInput === TYPE_INPUT.PASSWORD) {
    propsField.labelClassName = labelClassName;
  }
  if (typeInput === TYPE_INPUT.TEXT) {
    propsField.onPressEnter = onPressEnter;
  }

  return (
    <div className={cx(containerClassName, 'form-item')}>
      {label && typeInput !== TYPE_INPUT.PASSWORD && (
        <div className={cx(labelClassName, 'form-item__label')}>
          {label} {required ? '*' : ''}
        </div>
      )}
      {description && (
        <div className={cx(labelClassName, 'form-item__description')}>
          {description}
        </div>
      )}
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        label={label}
        component={componentRender}
        unit={unit}
        {...propsField}
      />
      <ErrorMessage
        name={errorField || name}
        component='div'
        className={cx('error-text', errorClassName)}
      />
      {children}
    </div>
  );
};

export default memo(FormItem);
