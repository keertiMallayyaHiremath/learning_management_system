export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  return <div>Subject {params.subjectId}</div>;
}