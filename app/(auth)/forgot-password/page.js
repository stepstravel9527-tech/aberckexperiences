import { fetchSupport } from '@/app/actions/support/data';
import Support from "@/components/support/Support";

const page = async () => {
    const support = await fetchSupport() || {};

    return (
        <Support
            support={{
                mobile_number: support.mobile_number,
                work_time: support.work_time,
                telegram: support.telegram
            }}
        />
    )
}

export default page