import { User } from "@/modals/User";

async function generateUniqueId() {
  let uniqueNumber = '';

  const maxNumber = await User.findOne().sort({id: -1}).lean();
  const nextMaxNumber = maxNumber?.id + 1
  uniqueNumber = nextMaxNumber;

  return uniqueNumber;
}

export default generateUniqueId;
