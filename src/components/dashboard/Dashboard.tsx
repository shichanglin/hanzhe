import React, { useRef, useState } from "react";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import ProForm, { ProFormDependency } from "@ant-design/pro-form";
import ProCard from "@ant-design/pro-card";
import "@ant-design/pro-table/dist/table.css";
import "@ant-design/pro-form/dist/form.css";
import "@ant-design/pro-card/dist/card.css";
import ExportJsonExcel from "js-export-excel";

type DataSourceType = {
  id: React.Key;
  type?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
  ishospital?: string;
  begin_pay?: number;
  paper?: number;
  pay_one?: number;
  pay_two?: number;
  pay_self?: number;
  pay_border?: number;
};

const defaultData: DataSourceType[] = [
  // {
  //   id: "624691229",
  //   type: "住院医疗费",
  //   begin_pay: 1111,
  //   ishospital: "是",
  //   pay_one: 111,
  //   pay_two: 111,
  //   pay_self: 111,
  //   pay_border: 111,
  //   paper: 2,
  //   created_at: "2020-05-26T08:19:22Z",
  // },
];
const Dashboard = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<any>>();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "报销类别",
      dataIndex: "type",
      key: "type",
      valueType: "select",
      valueEnum: {
        jizhen: {
          text: "门(急)诊医疗费",
          status: "门(急)诊医疗费",
        },
        zhuyuan: {
          text: "住院医疗费",
          status: "住院医疗费",
        },
        shengyu: {
          text: "生育医疗费",
          status: "生育医疗费",
        },
        zigou: {
          text: "药店自购药费",
          status: "1",
        },
        gongshang: {
          text: "工伤医疗费",
          status: "工伤医疗费",
        },
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "此项为必填项" }],
        };
      },
      width: "15%",
    },
    {
      title: "发生日期",
      dataIndex: "created_at",
      valueType: "date",
      key: "created_at",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "此项为必填项" }],
        };
      },
    },
    {
      title: "定点医院",
      dataIndex: "ishospital",
      valueType: "select",
      key: "ishospital",
      valueEnum: {
        yes: {
          text: "是",
          status: true,
        },
        no: {
          text: "否",
          status: false,
        },
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请选择" }],
        };
      },
    },
    {
      title: "起付标准(单位:元)",
      dataIndex: "begin_pay",
      key: "begin_pay",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请输入起付标准" }],
        };
      },
    },
    {
      title: "门诊票据张数",
      dataIndex: "paper",
      key: "paper",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请输入门诊票据张数" }],
        };
      },
    },
    {
      title: "自付一(单位:元)",
      dataIndex: "pay_one",
      key: "pay_one",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请输入自付一金额" }],
        };
      },
    },
    {
      title: "自付二(单位:元)",
      dataIndex: "pay_two",
      key: "pay_two",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请输入自付二金额" }],
        };
      },
    },
    {
      title: "自费(单位:元)",
      dataIndex: "pay_self",
      key: "pay_self",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请输入自费金额" }],
        };
      },
    },
    {
      title: "医疗范围内金额(单位:元)",
      dataIndex: "pay_border",
      key: "pay_border",
      formItemProps: () => {
        return {
          rules: [{ required: true, message: "请输入医疗范围内金额" }],
        };
      },
    },
    {
      title: "操作",
      valueType: "option",
      width: 150,
      render: (_, row) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue(
              "table"
            ) as DataSourceType[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== row?.id),
            });
          }}
        >
          移除
        </a>,
        <a
          key="edit"
          onClick={() => {
            actionRef.current?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  const handleExport = (values) => {
    const { table } = values; // 网络请求命名空间
    let date = new Date();
    const option = {
      fileName: `医疗报销单${date.toLocaleDateString()}`,
      datas: [
        {
          sheetData: table.map((item) => {
            let result = {};
            console.log(item);
            columns.forEach((c) => {
              console.log("c", c);
              eval("result." + c.dataIndex + "=" + "item." + c.dataIndex);
            });
            console.log(result);
            return result;
          }),
          sheetName: "ExcelName", // Excel文件名称
          sheetFilter: columns.map((item) => item.dataIndex),
          sheetHeader: columns.map((item) => item.title),
          columnWidths: columns.map(() => 10),
        },
      ],
    };
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  return (
    <ProCard>
      <ProForm<{
        table: DataSourceType[];
      }>
        formRef={formRef}
        initialValues={{
          table: defaultData,
        }}
        submitter={{
          render: (props, doms) => {
            return [...doms];
          },
        }}
        onFinish={async (values) => {
          handleExport(values);
          return true;
        }}
        onReset={() => {
          defaultData.length = 0;
          defaultData.push({
            id: "624748504",
            type: "jizhen",
            ishospital: "是",
            begin_pay: 0,
            paper: 0,
            pay_one: 0,
            pay_two: 0,
            pay_self: 0,
            pay_border: 0,
            created_at: "2020-05-26T09:42:56Z",
          });
        }}
      >
        <ProFormDependency name={["table"]}>
          {({ table }) => {
            const info = table.reduce(
              (pre, item) => {
                const { type, begin_pay, pay_one, pay_two, pay_self } = item;
                if (type === "jizhen") {
                  let payAllMenZhen = Number(pay_one) + Number(pay_two);
                  pre.paySelf = Number(pay_self);
                  if (payAllMenZhen >= Number(begin_pay)) {
                    pre.noMoney = payAllMenZhen + pre.noMoney;
                  } else {
                    pre.noMoney = pre.noMoney + payAllMenZhen * 0.9;
                  }
                } else if (type === "zhuyuan") {
                  pre.paySelf = Number(pay_self) + pre.paySelf;
                  let payAllZhuYuan = Number(pay_one) + Number(pay_two);
                  if (payAllZhuYuan >= Number(begin_pay)) {
                    pre.noMoney = pre.noMoney + payAllZhuYuan;
                  } else {
                    pre.noMoney = pre.noMoney + payAllZhuYuan * 90;
                  }
                } else if (type === "shengyu") {
                  let payAllShengyu = Number(pay_one) + Number(pay_two);
                  if (payAllShengyu >= 6000) {
                    pre.noMoney = pre.noMoney + 6000;
                    pre.paySelf =
                      payAllShengyu - 6000 + pre.paySelf + Number(pay_self);
                  } else {
                    pre.noMoney =
                      pre.noMoney + payAllShengyu + Number(pay_self);
                  }
                } else if (type == "gongshang") {
                  pre.noMoney =
                    pre.noMoney +
                    Number(pay_one) +
                    Number(pay_two) +
                    Number(pay_self);
                } else if (type == "zigou") {
                  pre.paySelf =
                    pre.paySelf +
                    Number(pay_one) +
                    Number(pay_two) +
                    Number(pay_self);
                }
                return { noMoney: pre.noMoney, paySelf: pre.paySelf };
              },
              { noMoney: 0, paySelf: 0 }
            );
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingBottom: 16,
                }}
              >
                <div style={{ flex: 2 }}>
                  个人限制报销金额：{info.paySelf} 元
                </div>
                <div style={{ flex: 2 }}>
                  单位统筹报销金额：{info.noMoney} 元
                </div>
              </div>
            );
          }}
        </ProFormDependency>
        <EditableProTable<DataSourceType>
          rowKey="id"
          controlled
          headerTitle="医疗报销表单"
          maxLength={10}
          name="table"
          actionRef={actionRef}
          recordCreatorProps={{
            record: (index) => {
              return { id: index + (Math.random() * 1000000).toFixed(0) };
            },
          }}
          columns={columns}
          editable={{
            type: "multiple",
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, config, defaultDom) => {
              return [defaultDom.save, defaultDom.delete || defaultDom.cancel];
            },
          }}
        />
      </ProForm>
    </ProCard>
  );
};

export default Dashboard;
