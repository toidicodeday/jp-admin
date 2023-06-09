import { Button, Input, message, Popconfirm, Table } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import editImg from "@images/btn-edit.svg";
import removeImg from "@images/btn-remove.svg";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { CourseType } from "@/services/commonType";
import { useDebounceState } from "@/hooks/useDebounceState";
import api from "@/services";

const initPageNo = 1;
const initPageSize = 5;

const CourseList = () => {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [pageNo, setPageNo] = useState(initPageNo);
  const [pageSize, setPageSize] = useState(initPageSize);
  const [dataTable, setDataTable] = useState<CourseType[]>([]);
  const [totalCourse, setTotalCourse] = useState<number>(0);
  const [loadingTable, setLoadingTable] = useState(false);
  const {
    dbValue: searchName,
    handleChange: onSearch,
    isDebounce,
  } = useDebounceState();

  const getDocuments = useCallback(async () => {
    setLoadingTable(true);
    const response = await api.course.getCourseList({
      pageNo,
      pageSize,
      searchName,
    });
    if (!isMounted.current) return null;
    if (response) {
      setDataTable(response.documents);
      setTotalCourse(response.total);
    }
    setLoadingTable(false);
  }, [pageNo, pageSize, searchName]);

  useEffect(() => {
    isMounted.current = true;
    getDocuments();
    return () => {
      isMounted.current = false;
    };
  }, [getDocuments]);

  const goToCreatePage = () => {
    navigate("/courses/courses-create");
  };

  const goToEditPage = (record: any) => {
    navigate(`/courses/${record?.$id}`);
  };

  const confirmDelete = async (course: CourseType) => {
    const response = await api.course.deleteOneCourse(course.$id);
    if (response) {
      message.success("Delete successful");
      getDocuments();
    }
  };

  const columns: ColumnsType<CourseType> = [
    {
      title: "Course",
      dataIndex: "course",
      render: (text, record) => {
        return (
          <div className="flex gap-9">
            <img
              className="w-52 h-32 object-contain bg-slate-50 rounded-md"
              src={record.img}
              alt="course-img"
            />
            <div>
              <p className="font-bold text-lg mb-2">{record.name}</p>
              <p className="font-normal text-lg">{record.desc}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (v) => {
        const cost = Number(v);
        if (cost <= 0) return "FREE";
        return "$" + v;
      },
    },
    {
      title: "Interested",
      dataIndex: "interested",
    },
    {
      key: "action",
      render: (text, record) => (
        <div className="flex justify-end">
          <Button
            type="text"
            onClick={() => goToEditPage(record)}
            icon={<img src={editImg} alt="" />}
          />
          <Popconfirm
            title="Delete Course"
            description="Are you sure to delete this item?"
            onConfirm={() => confirmDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<img src={removeImg} alt="" />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="pt-6 px-8 pb-10">
      <div className="p-6 bg-white flex items-center">
        <Input
          className="w-60"
          placeholder="Search course name"
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </div>
      <div className="py-5 flex justify-end">
        <Button type="primary" onClick={goToCreatePage}>
          Create new
        </Button>
      </div>
      <div className="pb-52 bg-white">
        <Table
          columns={columns}
          rowKey={"$id"}
          dataSource={dataTable}
          loading={loadingTable || isDebounce}
          pagination={{
            pageSize: pageSize,
            defaultCurrent: initPageNo,
            total: totalCourse,
            onChange: (newPageNo, newPageSize) => {
              setPageNo(newPageNo);
              setPageSize(newPageSize);
            },
          }}
        />
      </div>
    </div>
  );
};

export default CourseList;
