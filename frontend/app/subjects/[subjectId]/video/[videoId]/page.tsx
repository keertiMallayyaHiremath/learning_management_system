export default function VideoPage({ params }: { params: { subjectId: string; videoId: string } }) {
  return <div>Video {params.videoId} of subject {params.subjectId}</div>;
}