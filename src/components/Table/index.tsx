import React, { FC, useCallback, useMemo } from 'react';
import { Pagination, Skeleton, Table, Button } from 'antd';
import { useTranslation } from 'react-i18next';

// import Nodata from "resources/images/nodata.png";
import IconArrowRight from 'resources/svg/IconArrowRight';
import IconArrowLeft from 'resources/svg/IconArrowLeft';

import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '../../common/constant';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import {
  FilterValue,
  GetRowKey,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/lib/table/interface';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

type TableProps = {
  columns?: ColumnsType<any>;
  dataSource?: readonly any[];
  current?: number;
  pageSize?: number;
  total?: number;
  rowClassName?: string;
  pageSizeOptions?: string[];
  onChangeTable?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => void;
  onChangePagination?: (page: number, pageSize?: number) => void;
  size?: SizeType;
  bordered?: boolean;
  rowKey?: string | GetRowKey<any>;
  className?: string;
  scroll?: any;
  loading?: boolean;
  showTotal?: boolean;
  showSizeChanger?: boolean;
  showPagination?: boolean;
};

const TableComponent: FC<TableProps> = ({
  columns,
  dataSource,
  current,
  pageSize,
  total,
  rowClassName,
  pageSizeOptions,
  onChangeTable,
  onChangePagination,
  size,
  bordered,
  rowKey,
  className,
  scroll,
  loading,
  showTotal = true,
  showSizeChanger = false,
  showPagination = true,
}) => {
  const { t } = useTranslation();
  const renderShowTotal = (total: number) => (
    <div className='total-count'>{`${t(
      'common.txt_total_count'
    )}: ${total}`}</div>
  );

  const RenderEmptyData = () => (
    <div className='ant-empty-text'>
      <img src={''} alt='No data found' />
      <p>No data</p>
    </div>
  );

  const itemRender = (current: number, type: string, originalElement: any) => {
    if (type === 'prev') {
      return <Button className='button-pagination' icon={<IconArrowLeft />} />;
    }
    if (type === 'next') {
      return <Button className='button-pagination' icon={<IconArrowRight />} />;
    }
    return originalElement;
  };

  return (
    <div className='table'>
      <Table
        // locale={{
        //   emptyText: loading ? <Skeleton active={true} /> : RenderEmptyData,
        // }}
        pagination={false}
        columns={columns}
        bordered={bordered}
        rowClassName={rowClassName}
        dataSource={dataSource}
        onChange={onChangeTable}
        size={size}
        showSorterTooltip={false}
        rowKey={rowKey}
        className={className}
        scroll={scroll || { x: 960 }}
      />
      {showPagination && (
        <div className='my-pagination'>
          <Pagination
            size='small'
            total={total ? total : 0}
            current={current}
            onChange={onChangePagination}
            pageSizeOptions={pageSizeOptions ?? PAGE_SIZE_OPTIONS}
            pageSize={pageSize ?? PAGE_SIZE_DEFAULT}
            showSizeChanger={showSizeChanger}
            showTotal={(showTotal && renderShowTotal) || undefined}
            itemRender={itemRender}
            showQuickJumper={Boolean(
              total && pageSize && total > pageSize * 10
            )}
          />
        </div>
      )}
    </div>
  );
};

export default TableComponent;
