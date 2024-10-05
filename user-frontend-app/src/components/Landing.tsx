import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userName } from "./stores/selector/user";
import { isLoading } from "./stores/selector/isLoaing";
import { Button } from "./ui/button";
import { Card, CardTitle, CardContent } from "./ui/card";

function Landing() {
  const navigate = useNavigate();
  const user = useRecoilValue(userName);
  const loading = useRecoilValue(isLoading);

  const benifits = [
    {
      title: "You don’t have to relocate or commute.",
      discription:
        "With online learning, the classroom comes to you. No matter what type of credential you’re interested in achieving—degree, professional certificate, qualification—you can access some of the most renowned educational institutions or industry leaders online.",
    },
    {
      title: "You can decide your learning space.",
      discription:
        "Whether you’re learning synchronously or asynchronously online, you don’t have to worry about the hurdles of getting to class. All you have to do is turn on your computer",
    },
    {
      title: "You can keep working while enrolled.",
      discription:
        "A lot of students work part-time or full-time while attending college or completing other programs designed to enhance their education or skill set. But the rigid scheduling of many in-person programs can make it hard to balance your professional obligations with your educational ones. ",
    },
    {
      title:
        "You can learn from top universities or industry-leading companies.",
      discription:
        "Many prestigious colleges and universities now offer online degree options. An online degree from a major institution typically has the same value as one you earned in person and may even expose you to more rigorous coursework or skills development.",
    },
    {
      title: "You might save money compared to in-person learning.",
      discription:
        "Beyond tuition and fees, there are a lot of costs associated with attending college or university—or a workshop, course, or certificate program—in person",
    },
    {
      title: "You can engage with a global peer network.",
      discription:
        "Diversity yields greater perspectives and insights. Thanks to the global availability of online learning, you may find yourself enrolled alongside students from around the world, which may in turn foster broader, more diverse opinions and learning.",
    },
  ];

  return (
    <div>
      <div className="flex justify-center mt-8 gap-2">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-orange-600 first:mt-0">
          Unlock
        </h2>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Your Creative Potential
        </h2>
      </div>
      <div className="flex justify-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          with Online Courses
        </h3>
      </div>
      <div className="flex justify-center">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Learn from Industry Experts and Enhance Your Skills
        </h4>
      </div>
      <div className="flex justify-center mt-8">
        <Button
          size={"lg"}
          className=" bg-orange-600 hover:bg-orange-800"
          onClick={() => {
            navigate("/courses");
          }}
        >
          Explore Courses
        </Button>
      </div>
      <div className="flex justify-center mt-14">
        <img className="rounded-xl" width={600} src={"/mainLogo.jpeg"}></img>
      </div>
      <div>
        <div className="mx-32">
          <div>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Benifits
            </h2>
          </div>
          <div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Online learning is expanding the reach of education and empowering
              more people than ever before to work toward their personal goals.
              Let’s go over some of the major benefits of online learning.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 my-8 justify-center">
            {benifits.map((benifit) => {
              return (
                <Card className="w-[350px] border-orange-200">
                  <CardContent>
                    <div className="m-2">
                      <div className="mb-4">
                        <CardTitle>
                          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            {benifit.title}
                          </h4>
                        </CardTitle>
                      </div>
                      <div>{benifit.discription}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
