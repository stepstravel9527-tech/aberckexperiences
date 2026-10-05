
import { fetchContent } from '@/app/actions/content/data'
import Content from '@/components/content/Content';

const page = async ({ params }) => {
    const { title } = params;
    const content = await fetchContent(title);
    const labels = {
        tc: 'Term and Conditions',
        faqs: 'FAQs',
        about: 'About Us',
        agent: 'Agent'
    };
    return (
        <Content title={labels[title]} description={content.description} />
    )
}

export default page