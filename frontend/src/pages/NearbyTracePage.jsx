import React, { useEffect, useState } from "react";
import { getTraceList } from "../api/spaceApi";
import Header from '../components/common/Header';
import TraceItem from '../components/spacepage/TraceItem';

const NearbyTracePage = () => {
  const [traceList, setTraceList] = useState([]);

  // 근처 방명록 조회 axios 호출
  useEffect(() => {
    getTraceList()

      .then((res) => {
        setTraceList(res.data)
      })
      .catch((err) => {
        console.log('주변 방명록 목록 가져오기 실패ㄱ-', err)
      })
  }, [])

  return (
    <>
      <Header title="근처 방명록 찾기" to='/space' />

      {traceList.map((trace, index) => (
        <TraceItem key={index} title={trace.title} traceId={trace.recordId} />
      )
      )}
    </>
  );
};

export default NearbyTracePage;