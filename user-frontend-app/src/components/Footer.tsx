import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Footer = () => {
  return (
    <div>
      <Card className="h-60 border-t-2 p-10">
        <CardContent>
          <div className="flex justify-between">
            <div>
              <div>
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-orange-600 first:mt-0">
                  CourseMenia
                </h2>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-2">
                  <Mail />
                  nikamditya@gmail.com
                </div>
                <div className="flex gap-2">
                  <Phone />
                  +91 9168483895
                </div>
                <div className="flex gap-2">
                  <MapPin />
                  Somewhere in the world
                </div>
              </div>
            </div>
            <div>
              <div>
                <p className="leading-7 font-semibold   [&:not(:first-child)]:mt-6">
                  Social Profiles
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Facebook />
                <Twitter />
                <Linkedin />
                <Github />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Footer;
