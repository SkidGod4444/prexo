import { isFreeUserFlag } from '@prexo/flags'

export default async function Test() {
  const isFreeUser = await isFreeUserFlag();
  console.log(isFreeUser)

  return (
    <div>
      {isFreeUser ? "Hell Yeah!" : "Fuck It"}
    </div>
  );
}
