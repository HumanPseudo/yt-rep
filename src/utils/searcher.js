export async function searchMusic(query) {
  const response = await fetch(`http://localhost:3800/api/v1/search?q=${encodeURIComponent(query)}`);
  const json = await response.json();
  return json.contents.map((item) => {
    const info = item.musicResponsiveListItemRenderer;
    const title = info.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
    const videoId = info.navigationEndpoint.watchEndpoint.videoId;
    const thumbnail = info.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.at(-1).url;
    const subtitle = info.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs.map(run => run.text).join(', ');

    return { title, videoId, thumbnail, subtitle };
  });
}
